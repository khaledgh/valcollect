package models

import (
	"gorm.io/gorm"
)

type Course struct {
	gorm.Model
	Title           string  `json:"title"`
	Slug            string  `json:"slug" gorm:"uniqueIndex;size:200"`
	Description     string  `json:"description" gorm:"type:text"`
	Overview        string  `json:"overview" gorm:"type:text"`
	Syllabus        string  `json:"syllabus" gorm:"type:text"` // HTML or MarkDown list
	Benefits        string  `json:"benefits" gorm:"type:text"`
	Price           float64 `json:"price"`
	Currency        string  `json:"currency" gorm:"default:'SAR'"`
	Image           string  `json:"image"`
	Duration        string  `json:"duration"`         // e.g., "11 sessions"
	SessionDuration string  `json:"session_duration"` // e.g., "2 hours"
	CourseCode      string  `json:"course_code" gorm:"uniqueIndex;size:20"`
	Category        string  `json:"category"`
}

type Instructor struct {
	gorm.Model
	Name       string `json:"name"`
	Speciality string `json:"speciality"`
	Bio        string `json:"bio" gorm:"type:text"`
	Image      string `json:"image"`
}

type Enrollment struct {
	gorm.Model
	StudentName   string `json:"student_name"`
	StudentEmail  string `json:"student_email"`
	CourseID      uint   `json:"course_id"`
	PaymentStatus string `json:"payment_status"` // Pending, Success, Failed
}

type LandingPage struct {
	gorm.Model
	Title           string `json:"title"`
	Slug            string `json:"slug" gorm:"uniqueIndex;size:200"`
	Description     string `json:"description" gorm:"type:text"`
	Content         string `json:"content" gorm:"type:longtext"`
	Status          string `json:"status" gorm:"default:'active'"` // active, draft
	// SEO Fields
	MetaTitle       string `json:"meta_title" gorm:"size:500"`
	MetaDescription string `json:"meta_description" gorm:"type:text"`
	Keywords        string `json:"keywords" gorm:"type:text"`
	// Hero Images
	Image           string `json:"image" gorm:"size:500"`      // Desktop 1920x1080
	MobileImage     string `json:"mobile_image" gorm:"size:500"` // Mobile 1080x1920
	ImageAlt        string `json:"image_alt" gorm:"size:300"`
	OgImage         string `json:"og_image" gorm:"size:500"` // Social sharing image
	// Analytics
	Views           int64  `json:"views" gorm:"default:0"`
}

type Lead struct {
	gorm.Model
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	Email         string `json:"email"`
	Phone         string `json:"phone"`
	Country       string `json:"country"`
	City          string `json:"city"`
	Status        string `json:"status" gorm:"default:'pending'"` // pending, confirmed, rejected
	LandingPageID uint   `json:"landing_page_id"`
	Source        string `json:"source"` // utm_source or Direct
}

// ===== NEW MODELS =====

type User struct {
	gorm.Model
	Username     string `json:"username" gorm:"uniqueIndex;size:100"`
	PasswordHash string `json:"-" gorm:"size:255"` // Never expose hash in JSON
	FullName     string `json:"full_name"`
	Role         string `json:"role" gorm:"default:'admin'"` // admin, superadmin
	Active       bool   `json:"active" gorm:"default:true"`
}

type ContactMessage struct {
	gorm.Model
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message" gorm:"type:text"`
	Status  string `json:"status" gorm:"default:'unread'"` // unread, read, replied
	Notes   string `json:"notes" gorm:"type:text"`
}

type PageView struct {
	gorm.Model
	Path      string `json:"path" gorm:"size:500"`
	IP        string `json:"ip" gorm:"size:45"`
	UserAgent string `json:"user_agent" gorm:"type:text"`
	Referrer  string `json:"referrer" gorm:"size:500"`
}
