package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"valcollect/backend/middleware"
	"valcollect/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var db *gorm.DB

func SetDB(database *gorm.DB) {
	db = database
}

func checkDB() bool {
	return db != nil
}

// ============================================================
// STATIC FALLBACKS (when DB is down)
// ============================================================

var fallbackCourses = []models.Course{
	{
		Model: gorm.Model{ID: 1}, 
		Title: "دورة المحلل الفني المعتمد", 
		Description: "تزويد المشاركين بالمهارات الأساسية لتحليل الأسواق المالية وقراءة الرسوم البيانية.", 
		Overview: "تهدف دورة المحلل الفني المعتمد إلى تزويد المشاركين بالأدوات والتقنيات الأساسية التي يستخدمها المتداولون المحترفون لتحليل الأسواق المالية. تركز الدورة على قراءة الرسوم البيانية، وتحديد اتجاهات السوق، واستخدام المؤشرات الفنية لاتخاذ قرارات تداول مدروسة.",
		Syllabus: "<li>مقدمة في الأسواق المالية والتحليل الفني</li><li>فهم الرسوم البيانية وهيكل السوق</li><li>تحليل الاتجاهات ومستويات الدعم والمقاومة</li><li>النماذج الفنية وأنماط الأسعار</li><li>المؤشرات الفنية والمذبذبات</li><li>تحليل أحجام التداول وزخم السوق</li><li>إدارة المخاطر وخطط التداول</li><li>بناء استراتيجية تداول باستخدام التحليل الفني</li>",
		Benefits: "توفر هذه الدورة معرفة عملية تساعد المشاركين على تحليل تحركات الأسواق بثقة ودقة أكبر. صُممت الدورة للمتداولين والمستثمرين والمهنيين في القطاع المالي الذين يسعون إلى تطوير مهاراتهم.",
		Price: 1875, 
		Image: "images/new/courses/Technical Analysis.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "TA-001",
	},
	{
		Model: gorm.Model{ID: 2}, 
		Title: "أخصائي التسويق الرقمي المعتمد", 
		Description: "تزويد المشاركين بالمعرفة والمهارات العملية لإدارة الحملات التسويقية الرقمية بفعالية.", 
		Overview: "تهدف الدورة إلى تزويد المشاركين بالمعرفة النظرية والمهارات العملية المتقدمة التي تمكنهم من إدارة الحملات التسويقية الرقمية بشكل احترافي وفعّال. تركز الدورة على تطوير فهم شامل لاستراتيجيات التسويق عبر الإنترنت.",
		Syllabus: "<li>مقدمة في التسويق الرقمي</li><li>استراتيجيات التسويق عبر وسائل التواصل الاجتماعي</li><li>تحسين محركات البحث (SEO)</li><li>التسويق عبر البريد الإلكتروني والإعلانات الرقمية</li><li>تحليل البيانات وقياس الأداء</li>",
		Benefits: "تمكّن هذه الدورة المشاركين من تطوير مهارات تسويقية رقمية شاملة، مما يعزز فرصهم المهنية في مجالات التسويق الإلكتروني وإدارة العلامات التجارية.",
		Price: 1875, 
		Image: "images/new/courses/Digital Marketing.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "DM-002",
	},
	{
		Model: gorm.Model{ID: 3}, 
		Title: "أخصائي التسويق عبر وسائل التواصل الاجتماعي", 
		Description: "المهارات الأساسية والاستراتيجيات الحديثة لإدارة وتنمية العلامات التجارية عبر السوشيال ميديا.", 
		Overview: "دورة متقدمة في إدارة منصات التواصل الاجتماعي وخرائط الطريق لبناء العلامة التجارية الشخصية والمؤسسية.",
		Syllabus: "<li>استراتيجيات المحتوى الرقمي</li><li>إدارة منصات تويتر وانستجرام وتيك توك</li><li>تحليل وصول الجمهور والتفاعل</li><li>الحملات الإعلانية الممولة</li>",
		Benefits: "القدرة على إدارة الحسابات الكبرى وبناء استراتيجيات نمو حقيقية.",
		Price: 1875, 
		Image: "images/new/courses/Social Media.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "SM-003",
	},
	{
		Model: gorm.Model{ID: 4}, 
		Title: "أخصائي الإدارة المالية المعتمد", 
		Description: "المعرفة والمهارات العملية اللازمة لإدارة الموارد المالية بفعالية واحترافية.", 
		Overview: "تأهيل المحاسبين والمديرين الماليين على أدوات التخطيط المالي الحديثة.",
		Syllabus: "<li>القوائم المالية وتحليلها</li><li>التدفقات النقدية والميزانيات التقديرية</li><li>إدارة التمويل والاستثمار</li>",
		Benefits: "الحصول على مهارات قيادية في القطاع المالي.",
		Price: 7500, 
		Image: "images/new/courses/Financial Management.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "FM-004",
	},
	{
		Model: gorm.Model{ID: 5}, 
		Title: "مدير الموارد البشرية المعتمد", 
		Description: "المهارات والمعرفة اللازمة لإدارة الموارد البشرية وبناء بيئة عمل فعالة.", 
		Overview: "فهم شامل لدورة حياة الموظف وأنظمة العمل والعمال.",
		Syllabus: "<li>الاستقطاب والتوظيف</li><li>إدارة الأداء والتقييم</li><li>التدريب والتطوير المؤسسي</li><li>نظم الأجور والحوافز</li>",
		Benefits: "تطوير فكر استراتيجي في إدارة رأس المال البشري.",
		Price: 3750, 
		Image: "images/new/courses/HR Manager.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "HR-005",
	},
	{
		Model: gorm.Model{ID: 6}, 
		Title: "أخصائي إدارة المبيعات المعتمد", 
		Description: "تخطيط وتنظيم فرق المبيعات بفعالية لتحقيق أهداف النمو الاستراتيجي.", 
		Overview: "بناء فرق مبيعات قادرة على تحقيق الأرقام المستهدفة في ظروف السوق المتغيرة.",
		Syllabus: "<li>فن التفاوض والإقناع</li><li>إدارة علاقات العملاء CRM</li><li>توقعات المبيعات وتحليل السوق</li>",
		Benefits: "تحسين معدلات التحويل وزيادة الإيرادات.",
		Price: 940, 
		Image: "images/new/courses/Sales Manager.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "SL-006",
	},
	{
		Model: gorm.Model{ID: 7}, 
		Title: "أخصائي معتمد في الكتابة التجارية", 
		Description: "إعداد مستندات ومراسلات احترافية واضحة وفعّالة لقطاع الأعمال.",
		Overview: "تمكين الموظفين من كتابة تقارير وخطابات رسمية خالية من الأخطاء ومؤثرة.", 
		Syllabus: "<li>صياغة البريد الإلكتروني الرسمي</li><li>كتابة التقارير الإدارية</li><li>إعداد محاضر الاجتماعات</li>",
		Benefits: "التواصل الاحترافي الذي يرفع من جودة العمل المؤسسي.",
		Price: 940, 
		Image: "images/new/courses/Business Writing.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "BW-007",
	},
	{
		Model: gorm.Model{ID: 8}, 
		Title: "أخصائي معتمد في أساسيات الكومبيوتر", 
		Description: "المعرفة الأساسية لفهم مكونات الكومبيوتر وأنظمة التشغيل والبرمجيات.",
		Overview: "نقطة البداية لكل من يريد دخول عالم التقنية وفهم أدوات العمل المكتبي.", 
		Syllabus: "<li>أنظمة التشغيل Windows</li><li>حزم ميكروسوفت أوفيس</li><li>أمن المعلومات الأساسي</li>",
		Benefits: "التمكن من استخدام الحاسب الآلي في كافة المهام اليومية.",
		Price: 565, 
		Image: "images/new/courses/Computer Professional.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "CP-008",
	},
	{
		Model: gorm.Model{ID: 9}, 
		Title: "أخصائي معتمد في البرمجة", 
		Description: "تصميم وتطوير البرامج باستخدام لغات البرمجة الأساسية ومفاهيم الهندسة البرمجية.",
		Overview: "بناء منطق برمجي قوي يمكّنك من تعلم أي لغة برمجة بسرعة.", 
		Syllabus: "<li>أساسيات الخوارزميات</li><li>البرمجة بلغة Java/C#</li><li>قواعد البيانات SQL</li><li>بناء تطبيقات الويب البسيطة</li>",
		Benefits: "فتح آفاق واسعة في سوق العمل التقني المتنامي.",
		Price: 3750, 
		Image: "images/new/courses/Programming.jpg", 
		Duration: "12 جلسة",
		SessionDuration: "ساعتان",
		CourseCode: "PG-009",
	},
}

// ============================================================
// AUTHENTICATION
// ============================================================

func Login(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database offline"})
		return
	}
	var body struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username and password are required"})
		return
	}

	var user models.User
	if err := db.Where("username = ? AND active = ?", body.Username, true).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := middleware.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":        user.ID,
			"username":  user.Username,
			"full_name": user.FullName,
			"role":      user.Role,
		},
	})
}

func GetMe(c *gin.Context) {
	userID, _ := c.Get("userID")
	username, _ := c.Get("username")
	role, _ := c.Get("role")
	c.JSON(http.StatusOK, gin.H{
		"id":       userID,
		"username": username,
		"role":     role,
	})
}

// ============================================================
// PUBLIC API — COURSES
// ============================================================

func GetCourses(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusOK, fallbackCourses)
		return
	}
	var courses []models.Course
	db.Find(&courses)
	c.JSON(http.StatusOK, courses)
}

func GetCourseDetails(c *gin.Context) {
	id := c.Param("id")
	if !checkDB() {
		idNum, _ := strconv.Atoi(id)
		for _, course := range fallbackCourses {
			if course.ID == uint(idNum) {
				c.JSON(http.StatusOK, course)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	var course models.Course
	if err := db.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	c.JSON(http.StatusOK, course)
}

func GetInstructors(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusOK, []interface{}{})
		return
	}
	var instructors []models.Instructor
	db.Find(&instructors)
	c.JSON(http.StatusOK, instructors)
}

func GetStats(c *gin.Context) {
	stats := gin.H{"awards": 25, "centers": 10, "experience": 20, "students_count": 25000}
	if checkDB() {
		var coursesCount, enrollmentsCount int64
		db.Model(&models.Course{}).Count(&coursesCount)
		db.Model(&models.Enrollment{}).Count(&enrollmentsCount)
		stats["courses_count"] = coursesCount
		stats["enrollments_count"] = enrollmentsCount
	}
	c.JSON(http.StatusOK, stats)
}

// ============================================================
// PUBLIC API — ENROLLMENT & CONTACT
// ============================================================

func EnrollStudent(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Offline"})
		return
	}
	var enrollment models.Enrollment
	if err := c.ShouldBindJSON(&enrollment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}
	enrollment.PaymentStatus = "Pending"
	db.Create(&enrollment)
	c.JSON(http.StatusCreated, enrollment)
}

func SubmitContactMessage(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Offline"})
		return
	}
	var msg models.ContactMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}
	msg.Status = "unread"
	db.Create(&msg)
	c.JSON(http.StatusCreated, gin.H{"message": "تم إرسال رسالتك بنجاح"})
}

func SubmitLead(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Offline"})
		return
	}
	var lead models.Lead
	if err := c.ShouldBindJSON(&lead); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}
	lead.Status = "pending"
	db.Create(&lead)
	c.JSON(http.StatusCreated, gin.H{"message": "Lead captured"})
}

// ============================================================
// ADMIN — COURSES CRUD
// ============================================================

func AdminCreateCourse(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	var course models.Course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&course)
	c.JSON(http.StatusCreated, course)
}

func AdminUpdateCourse(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	var course models.Course
	if err := db.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&course)
	c.JSON(http.StatusOK, course)
}

func AdminDeleteCourse(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	db.Delete(&models.Course{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// ============================================================
// ADMIN — LEADS (CRUD + Filters + Excel)
// ============================================================

func GetLeads(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	query := db.Model(&models.Lead{})

	// Filters
	if s := c.Query("status"); s != "" {
		query = query.Where("status = ?", s)
	}
	if s := c.Query("source"); s != "" {
		query = query.Where("source = ?", s)
	}
	if s := c.Query("city"); s != "" {
		query = query.Where("city LIKE ?", "%"+s+"%")
	}
	if s := c.Query("search"); s != "" {
		search := "%" + s + "%"
		query = query.Where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?", search, search, search, search)
	}
	if from := c.Query("from"); from != "" {
		query = query.Where("created_at >= ?", from)
	}
	if to := c.Query("to"); to != "" {
		query = query.Where("created_at <= ?", to)
	}

	var leads []models.Lead
	query.Order("created_at desc").Find(&leads)
	c.JSON(http.StatusOK, leads)
}

func UpdateLeadStatus(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	var body struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err == nil {
		db.Model(&models.Lead{}).Where("id = ?", id).Update("status", body.Status)
		c.JSON(http.StatusOK, gin.H{"message": "Lead updated"})
	}
}

func DeleteLead(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	db.Delete(&models.Lead{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func BulkDeleteLeads(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	var body struct {
		IDs []uint `json:"ids"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || len(body.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No IDs provided"})
		return
	}
	db.Where("id IN ?", body.IDs).Delete(&models.Lead{})
	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("%d leads deleted", len(body.IDs))})
}

// ============================================================
// ADMIN — ENROLLMENTS
// ============================================================

func GetEnrollments(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	query := db.Model(&models.Enrollment{})
	if s := c.Query("status"); s != "" {
		query = query.Where("payment_status = ?", s)
	}
	if s := c.Query("search"); s != "" {
		search := "%" + s + "%"
		query = query.Where("student_name LIKE ? OR student_email LIKE ?", search, search)
	}
	var enrollments []models.Enrollment
	query.Order("created_at desc").Find(&enrollments)
	c.JSON(http.StatusOK, enrollments)
}

func UpdateEnrollmentStatus(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	var body struct {
		PaymentStatus string `json:"payment_status"`
	}
	if err := c.ShouldBindJSON(&body); err == nil {
		db.Model(&models.Enrollment{}).Where("id = ?", id).Update("payment_status", body.PaymentStatus)
		c.JSON(http.StatusOK, gin.H{"message": "Updated"})
	}
}

func DeleteEnrollment(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	db.Delete(&models.Enrollment{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// ============================================================
// ADMIN — LANDING PAGES CRUD
// ============================================================

func GetLandingPages(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	var pages []models.LandingPage
	db.Order("created_at desc").Find(&pages)
	c.JSON(http.StatusOK, pages)
}

func CreateLandingPage(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	var page models.LandingPage
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if page.Status == "" {
		page.Status = "active"
	}
	db.Create(&page)
	c.JSON(http.StatusCreated, page)
}

func UpdateLandingPage(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	var page models.LandingPage
	if err := db.First(&page, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&page)
	c.JSON(http.StatusOK, page)
}

func DeleteLandingPage(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	db.Delete(&models.LandingPage{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// UploadLandingPageImage handles file upload for landing page images
func UploadLandingPageImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// Create upload dir
	uploadDir := "./uploads/landing-pages"
	os.MkdirAll(uploadDir, 0755)

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	filePath := filepath.Join(uploadDir, filename)

	out, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer out.Close()
	io.Copy(out, file)

	c.JSON(http.StatusOK, gin.H{
		"url":      "/uploads/landing-pages/" + filename,
		"filename": filename,
	})
}

// ============================================================
// PUBLIC — LANDING PAGE BY SLUG
// ============================================================

func GetLandingPageBySlug(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	slug := c.Param("slug")
	var page models.LandingPage
	if err := db.Where("slug = ? AND status = 'active'", slug).First(&page).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Page not found"})
		return
	}
	// Increment views
	db.Model(&page).Update("views", gorm.Expr("views + 1"))
	c.JSON(http.StatusOK, page)
}

// ============================================================
// ADMIN — CONTACT MESSAGES
// ============================================================

func GetMessages(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	query := db.Model(&models.ContactMessage{})
	if s := c.Query("status"); s != "" {
		query = query.Where("status = ?", s)
	}
	if s := c.Query("search"); s != "" {
		search := "%" + s + "%"
		query = query.Where("name LIKE ? OR email LIKE ? OR subject LIKE ?", search, search, search)
	}
	var messages []models.ContactMessage
	query.Order("created_at desc").Find(&messages)
	c.JSON(http.StatusOK, messages)
}

func UpdateMessageStatus(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	var body struct {
		Status string `json:"status"`
		Notes  string `json:"notes"`
	}
	if err := c.ShouldBindJSON(&body); err == nil {
		updates := map[string]interface{}{"status": body.Status}
		if body.Notes != "" {
			updates["notes"] = body.Notes
		}
		db.Model(&models.ContactMessage{}).Where("id = ?", id).Updates(updates)
		c.JSON(http.StatusOK, gin.H{"message": "Updated"})
	}
}

func DeleteMessage(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}
	id := c.Param("id")
	db.Delete(&models.ContactMessage{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// ============================================================
// ADMIN — ANALYTICS
// ============================================================

func GetAnalytics(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}

	// Summary counts
	var totalViews, todayViews, totalLeads, totalEnrollments, totalMessages, unreadMessages int64
	db.Model(&models.PageView{}).Count(&totalViews)
	db.Model(&models.PageView{}).Where("DATE(created_at) = CURDATE()").Count(&todayViews)
	db.Model(&models.Lead{}).Count(&totalLeads)
	db.Model(&models.Enrollment{}).Count(&totalEnrollments)
	db.Model(&models.ContactMessage{}).Count(&totalMessages)
	db.Model(&models.ContactMessage{}).Where("status = 'unread'").Count(&unreadMessages)

	// Views per day (last 30 days)
	type DayStat struct {
		Date  string `json:"date"`
		Count int64  `json:"count"`
	}
	var viewsByDay []DayStat
	db.Raw("SELECT DATE(created_at) as date, COUNT(*) as count FROM page_views WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date").Scan(&viewsByDay)

	// Leads per day (last 30 days)
	var leadsByDay []DayStat
	db.Raw("SELECT DATE(created_at) as date, COUNT(*) as count FROM leads WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date").Scan(&leadsByDay)

	// Top pages
	type PageStat struct {
		Path  string `json:"path"`
		Count int64  `json:"count"`
	}
	var topPages []PageStat
	db.Raw("SELECT path, COUNT(*) as count FROM page_views GROUP BY path ORDER BY count DESC LIMIT 10").Scan(&topPages)

	// Lead sources
	type SourceStat struct {
		Source string `json:"source"`
		Count  int64  `json:"count"`
	}
	var leadSources []SourceStat
	db.Raw("SELECT COALESCE(source, 'Direct') as source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC").Scan(&leadSources)

	c.JSON(http.StatusOK, gin.H{
		"summary": gin.H{
			"total_views":       totalViews,
			"today_views":       todayViews,
			"total_leads":       totalLeads,
			"total_enrollments": totalEnrollments,
			"total_messages":    totalMessages,
			"unread_messages":   unreadMessages,
		},
		"views_by_day": viewsByDay,
		"leads_by_day": leadsByDay,
		"top_pages":    topPages,
		"lead_sources": leadSources,
	})
}

// TrackPageView middleware to record analytics
func TrackPageView() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next() // Process first

		if !checkDB() {
			return
		}
		// Only track GET requests on public pages
		if c.Request.Method != "GET" {
			return
		}
		path := c.Request.URL.Path
		// Skip admin/health/api paths for analytics
		if strings.HasPrefix(path, "/api/v1/admin") || path == "/health" {
			return
		}

		go func() {
			view := models.PageView{
				Path:      path,
				IP:        c.ClientIP(),
				UserAgent: c.Request.UserAgent(),
				Referrer:  c.Request.Referer(),
			}
			db.Create(&view)
		}()
	}
}

// ============================================================
// ADMIN — EXCEL EXPORT / IMPORT
// ============================================================

func ExportLeadsExcel(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}

	var leads []models.Lead
	query := db.Model(&models.Lead{})
	if s := c.Query("status"); s != "" {
		query = query.Where("status = ?", s)
	}
	query.Order("created_at desc").Find(&leads)

	f := excelize.NewFile()
	sheet := "Leads"
	f.SetSheetName("Sheet1", sheet)

	// Header styling
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12, Color: "FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Pattern: 1, Color: []string{"8B00FF"}},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
	})

	headers := []string{"ID", "First Name", "Last Name", "Email", "Phone", "City", "Country", "Source", "Status", "Created At"}
	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
		f.SetCellStyle(sheet, cell, cell, headerStyle)
	}

	for i, lead := range leads {
		row := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), lead.ID)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), lead.FirstName)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), lead.LastName)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), lead.Email)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), lead.Phone)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), lead.City)
		f.SetCellValue(sheet, fmt.Sprintf("G%d", row), lead.Country)
		f.SetCellValue(sheet, fmt.Sprintf("H%d", row), lead.Source)
		f.SetCellValue(sheet, fmt.Sprintf("I%d", row), lead.Status)
		f.SetCellValue(sheet, fmt.Sprintf("J%d", row), lead.CreatedAt.Format("2006-01-02 15:04"))
	}

	// Auto-width columns
	for i := range headers {
		col, _ := excelize.ColumnNumberToName(i + 1)
		f.SetColWidth(sheet, col, col, 18)
	}

	filename := fmt.Sprintf("leads_export_%s.xlsx", time.Now().Format("2006-01-02"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	f.Write(c.Writer)
}

func ImportLeadsExcel(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}

	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	f, err := excelize.OpenReader(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Excel file"})
		return
	}

	rows, err := f.GetRows(f.GetSheetName(0))
	if err != nil || len(rows) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Empty or invalid sheet"})
		return
	}

	var imported int
	for i, row := range rows {
		if i == 0 {
			continue // Skip header
		}
		if len(row) < 5 {
			continue
		}
		lead := models.Lead{
			FirstName: strings.TrimSpace(row[0]),
			LastName:  strings.TrimSpace(row[1]),
			Email:     strings.TrimSpace(row[2]),
			Phone:     strings.TrimSpace(row[3]),
			Status:    "pending",
		}
		if len(row) > 4 {
			lead.City = strings.TrimSpace(row[4])
		}
		if len(row) > 5 {
			lead.Country = strings.TrimSpace(row[5])
		}
		if len(row) > 6 {
			lead.Source = strings.TrimSpace(row[6])
		}
		db.Create(&lead)
		imported++
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Successfully imported %d leads", imported)})
}

func ExportEnrollmentsExcel(c *gin.Context) {
	if !checkDB() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "DB Offline"})
		return
	}

	var enrollments []models.Enrollment
	db.Order("created_at desc").Find(&enrollments)

	f := excelize.NewFile()
	sheet := "Enrollments"
	f.SetSheetName("Sheet1", sheet)

	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Size: 12, Color: "FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Pattern: 1, Color: []string{"0F2C52"}},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
	})

	headers := []string{"ID", "Student Name", "Student Email", "Course ID", "Payment Status", "Created At"}
	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
		f.SetCellStyle(sheet, cell, cell, headerStyle)
	}

	for i, e := range enrollments {
		row := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), e.ID)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), e.StudentName)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), e.StudentEmail)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), e.CourseID)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), e.PaymentStatus)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), e.CreatedAt.Format("2006-01-02 15:04"))
	}

	for i := range headers {
		col, _ := excelize.ColumnNumberToName(i + 1)
		f.SetColWidth(sheet, col, col, 20)
	}

	filename := fmt.Sprintf("enrollments_export_%s.xlsx", time.Now().Format("2006-01-02"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	f.Write(c.Writer)
}
