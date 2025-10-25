package service

import (
	"github.com/aruncs31s/esdcprojectmodule/dto"
	repository "github.com/aruncs31s/esdcprojectmodule/interfaces/repository"
)

type publicProjectsService struct {
	publicProjectRepository repository.PublicProjectRepository
}

func (s *publicProjectsService) GetAllProjects(limit, offset int, user string) ([]dto.ProjectResponse, error) {
	projects, err := s.publicProjectRepository.GetAllProjects(limit, offset)
	if err != nil {
		return nil, err
	}
	if projects == nil || len(*projects) == 0 {
		return []dto.ProjectResponse{}, nil
	}

	projectsPresentation := make([]dto.ProjectResponse, len(*projects))
	for i, project := range *projects {
		projectsPresentation[i] = dto.ProjectResponseForPublic{
			ID:                  project.ID,
			Title:               project.Title,
			Description:         project.Description,
			GithubLink:          project.GithubLink,
			Image:               project.Image,
			LiveUrl:             project.LiveURL,
			CreatedAt:           project.CreatedAt,
			UpdatedAt:           project.UpdatedAt,
			Status:              project.Status,
			Likes:               project.Likes,
			ViewCount:           project.Views,
			CommentCount:        0,
			ForkCount:           0,
			StartCount:          0,
			FavoriteCount:       0,
			Version:             project.Version,
			Cost:                project.Cost,
			Category:            project.Category,
			CreatorDetails:      getCreatorDetails(project.Creator),
			ContributorsDetails: getContributorsUsernames(project.Contributors),
			TagsDetails:         getTagsNames(project.Tags),
			TechnologyDetails:   getTechnologiesNames(project.Technologies),
		}
	}
	return projectsPresentation, nil
}
