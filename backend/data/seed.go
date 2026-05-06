package data

import (
	"log"
	"valcollect/backend/models"
	"gorm.io/gorm"
)

func SeedData(db *gorm.DB) {
	// Seed Courses
	courses := []models.Course{
		{
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
			Slug: "course-technical-analysis",
		},
		{
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
			Slug: "course-digital-marketing",
		},
		{
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
			Slug: "course-social-media",
		},
		{
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
			Slug: "course-financial-management",
		},
		{
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
			Slug: "course-hr-manager",
		},
		{
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
			Slug: "course-sales-manager",
		},
		{
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
			Slug: "course-business-writing",
		},
		{
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
			Slug: "course-computer-professional",
		},
		{
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
			Slug: "course-programming",
		},
	}

	for _, c := range courses {
		var existing models.Course
		// Match by CourseCode, Slug, or Title to handle existing data from previous versions
		if err := db.Where("course_code = ?", c.CourseCode).Or("slug = ?", c.Slug).Or("title = ?", c.Title).First(&existing).Error; err != nil {
			if err := db.Create(&c).Error; err != nil {
				log.Printf("Could not create course %s: %v", c.Title, err)
			}
		} else {
			// Update the ID to the existing record's ID to perform a full save
			c.ID = existing.ID
			if err := db.Save(&c).Error; err != nil {
				log.Printf("Could not save course %s: %v", c.Title, err)
			} else {
				log.Printf("Updated course: %s (ID: %d)", c.Title, existing.ID)
			}
		}
	}

	// Seed Instructors
	instructors := []models.Instructor{
		{
			Name:       "أ. عبدالله الثقفي (أبو رسيل)",
			Speciality: "خبير في التسويق ووسائل التواصل الاجتماعي",
			Bio:        "خبير متخصص في بناء الاستراتيجيات التسويقية الرقمية وإدارة منصات التواصل الاجتماعي للمؤسسات الكبرى.",
			Image:      "images/new/instructors/photo_2026-03-05_11-15-52.jpg",
		},
		{
			Name:       "أ. حبيب المغربي",
			Speciality: "خبير في الإدارة المالية",
			Bio:        "مستشار مالي معتمد ساعد العديد من الشركات في تنظيم تدفقاتها النقدية وتحسين أدائها المالي.",
			Image:      "images/new/instructors/photo_2026-03-05_11-15-41.jpg",
		},
		{
			Name:       "د. خيران الخياري",
			Speciality: "المحلل الفني للأسواق المحلية والعالمية",
			Bio:        "خبير في تحليل الشموع اليابانية واكتشاف فرص التداول في الأسواق المالية المحلية والدولية.",
			Image:      "images/new/instructors/photo_2026-03-05_11-15-44.jpg",
		},
		{
			Name:       "أ. بسام العبيد",
			Speciality: "خبير في مجال الكومبيوتر والبرمجة",
			Bio:        "مهندس برمجيات متخصص في لغات البرمجة الحديثة وتطوير البنية التحتية للأنظمة الرقمية.",
			Image:      "images/new/instructors/photo_2026-03-05_11-15-20.jpg",
		},
	}

	for _, i := range instructors {
		var existing models.Instructor
		if err := db.Where("name = ?", i.Name).First(&existing).Error; err != nil {
			db.Create(&i)
		} else {
			i.ID = existing.ID
			db.Save(&i)
		}
	}

	log.Println("Database Seeding complete with new Valcollect branding and ALL 4 instructors.")
}
