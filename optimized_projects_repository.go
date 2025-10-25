package repository

import (
	commonModules "github.com/aruncs31s/esdcmodels"
	"gorm.io/gorm"
)

type ProjectRepository interface {
	GetPublicProjects(limit, offset int) ([]commonModules.Project, error)
	GetUserProjects(userID uint, limit, offset int) ([]commonModules.Project, error)
	GetEssentialInfo(limit, offset int) ([]commonModules.Project, error)
	GetByID(id int) (commonModules.Project, error)
	GetProjectsCount() (int, error)
	IsLiked(userID uint, projectID int) (bool, error)
	Create(project *commonModules.Project) error
	LikeProject(userID uint, projectID int) error
	UnlikeProject(userID uint, projectID int) error
	FindOrCreateTag(name string) (*commonModules.Tag, error)
	FindOrCreateTechnology(name string) (*commonModules.Technologies, error)
}

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepository{db: db}
}

func (r *projectRepository) GetPublicProjects(limit, offset int) ([]commonModules.Project, error) {
	var projects []commonModules.Project
	err := r.db.Preload("Contributors").Preload("Creator").Preload("Tags").Preload("Technologies").
		Where("visibility = ?", 0).Limit(limit).Offset(offset).Find(&projects).Error
	return projects, err
}

func (r *projectRepository) GetUserProjects(userID uint, limit, offset int) ([]commonModules.Project, error) {
	var projects []commonModules.Project
	err := r.db.Preload("Contributors").Preload("Creator").Preload("Tags").Preload("Technologies").
		Where("created_by = ? OR visibility = ?", userID, 0).Limit(limit).Offset(offset).Find(&projects).Error
	return projects, err
}

func (r *projectRepository) GetEssentialInfo(limit, offset int) ([]commonModules.Project, error) {
	var projects []commonModules.Project
	err := r.db.Limit(limit).Offset(offset).Find(&projects).Error
	return projects, err
}

func (r *projectRepository) GetByID(id int) (commonModules.Project, error) {
	var project commonModules.Project
	err := r.db.Preload("Contributors").Preload("Creator").Preload("Tags").Preload("Technologies").First(&project, id).Error
	return project, err
}

func (r *projectRepository) Create(project *commonModules.Project) error {
	return r.db.Create(project).Error
}

func (r *projectRepository) GetProjectsCount() (int, error) {
	var count int64
	err := r.db.Model(&commonModules.Project{}).Count(&count).Error
	return int(count), err
}

func (r *projectRepository) FindOrCreateTag(name string) (*commonModules.Tag, error) {
	var tag commonModules.Tag
	err := r.db.Where("name = ?", name).FirstOrCreate(&tag, commonModules.Tag{Name: name}).Error
	return &tag, err
}

func (r *projectRepository) FindOrCreateTechnology(name string) (*commonModules.Technologies, error) {
	var tech commonModules.Technologies
	err := r.db.Where("name = ?", name).FirstOrCreate(&tech, commonModules.Technologies{Name: name}).Error
	return &tech, err
}

func (r *projectRepository) IsLiked(userID uint, projectID int) (bool, error) {
	var count int64
	err := r.db.Table("project_likes").Where("user_id = ? AND project_id = ?", userID, projectID).Count(&count).Error
	return count > 0, err
}

func (r *projectRepository) LikeProject(userID uint, projectID int) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var user commonModules.User
		var project commonModules.Project
		if err := tx.First(&user, userID).Error; err != nil {
			return err
		}
		if err := tx.First(&project, projectID).Error; err != nil {
			return err
		}
		if err := tx.Model(&user).Association("LikedProjects").Append(&project); err != nil {
			return err
		}
		return tx.Model(&commonModules.Project{}).Where("id = ?", projectID).Update("likes", gorm.Expr("likes + ?", 1)).Error
	})
}

func (r *projectRepository) UnlikeProject(userID uint, projectID int) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var user commonModules.User
		var project commonModules.Project
		if err := tx.First(&user, userID).Error; err != nil {
			return err
		}
		if err := tx.First(&project, projectID).Error; err != nil {
			return err
		}
		if err := tx.Model(&user).Association("LikedProjects").Delete(&project); err != nil {
			return err
		}
		return tx.Model(&commonModules.Project{}).Where("id = ?", projectID).Update("likes", gorm.Expr("likes - ?", 1)).Error
	})
}