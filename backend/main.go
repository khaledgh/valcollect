package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"valcollect/backend/data"
	"valcollect/backend/handlers"
	"valcollect/backend/middleware"
	"valcollect/backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("[INFO] No .env file found, using defaults.")
	}

	// Initialize Database
	db := initDB()
	if db != nil {
		handlers.SetDB(db)
		data.SeedData(db)
		seedAdmin(db)
	} else {
		log.Println("[WARNING] Database connection failed. Running with limited functionality.")
	}

	// Initialize Gin
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "https://sahmeeinstitute.com", "https://www.sahmeeinstitute.com", "https://sahcollect.com", "https://www.sahcollect.com", "https://sahcollect.com", "https://www.sahcollect.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Content-Disposition"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "time": time.Now().Format(time.RFC3339), "db": db != nil})
	})

	// Serve uploads
	r.Static("/uploads", "./uploads")

	// API Routes V1
	api := r.Group("/api/v1")
	api.Use(handlers.TrackPageView()) // Analytics tracking
	{
		// Courses
		api.GET("/courses", handlers.GetCourses)
		api.GET("/courses/:id", handlers.GetCourseDetails)
		api.GET("/instructors", handlers.GetInstructors)
		api.GET("/stats", handlers.GetStats)

		// Public submissions
		api.POST("/enroll", handlers.EnrollStudent)
		api.POST("/contact", handlers.SubmitContactMessage)
		api.POST("/leads", handlers.SubmitLead)
		api.GET("/landing-pages/:slug", handlers.GetLandingPageBySlug)

		// Auth
		api.POST("/auth/login", handlers.Login)
	}

	// ===== PROTECTED ADMIN API =====
	admin := r.Group("/api/v1/admin")
	admin.Use(middleware.AuthRequired())
	{
		admin.GET("/me", handlers.GetMe)

		// Courses CRUD
		admin.POST("/courses", handlers.AdminCreateCourse)
		admin.PUT("/courses/:id", handlers.AdminUpdateCourse)
		admin.DELETE("/courses/:id", handlers.AdminDeleteCourse)

		// Leads
		admin.GET("/leads", handlers.GetLeads)
		admin.PATCH("/leads/:id", handlers.UpdateLeadStatus)
		admin.DELETE("/leads/:id", handlers.DeleteLead)
		admin.POST("/leads/bulk-delete", handlers.BulkDeleteLeads)
		admin.GET("/leads/export", handlers.ExportLeadsExcel)
		admin.POST("/leads/import", handlers.ImportLeadsExcel)

		// Enrollments
		admin.GET("/enrollments", handlers.GetEnrollments)
		admin.PATCH("/enrollments/:id", handlers.UpdateEnrollmentStatus)
		admin.DELETE("/enrollments/:id", handlers.DeleteEnrollment)
		admin.GET("/enrollments/export", handlers.ExportEnrollmentsExcel)

		// Landing Pages
		admin.GET("/landing-pages", handlers.GetLandingPages)
		admin.POST("/landing-pages", handlers.CreateLandingPage)
		admin.PUT("/landing-pages/:id", handlers.UpdateLandingPage)
		admin.DELETE("/landing-pages/:id", handlers.DeleteLandingPage)
		admin.POST("/landing-pages/upload", handlers.UploadLandingPageImage)

		// Messages
		admin.GET("/messages", handlers.GetMessages)
		admin.PATCH("/messages/:id", handlers.UpdateMessageStatus)
		admin.DELETE("/messages/:id", handlers.DeleteMessage)

		// Analytics
		admin.GET("/analytics", handlers.GetAnalytics)
	}

	// Run Server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Valcollect Backend started on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}

func initDB() *gorm.DB {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	if user == "" {
		user = "root"
	}
	if host == "" {
		host = "127.0.0.1"
	}
	if port == "" {
		port = "3306"
	}
	if name == "" {
		name = "sahmee"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, host, port, name)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("[CRITICAL] Could not connect to MySQL: %v", err)
		return nil
	}

	// Auto Migration — all models
	db.AutoMigrate(
		&models.Course{},
		&models.Instructor{},
		&models.Enrollment{},
		&models.LandingPage{},
		&models.Lead{},
		&models.User{},
		&models.ContactMessage{},
		&models.PageView{},
	)
	log.Println("Database schemas synchronized.")

	return db
}

func seedAdmin(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count == 0 {
		hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := models.User{
			Username:     "admin",
			PasswordHash: string(hash),
			FullName:     "Valcollect Admin",
			Role:         "admin",
			Active:       true,
		}
		db.Create(&admin)
		log.Println("Default admin user created (admin / admin123)")
	}
}
