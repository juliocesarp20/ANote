package services

import (
	"anote/internal/domain"
	"anote/internal/errors"
	"anote/internal/helpers"
	IRepo "anote/internal/interfaces/repositories"
)

type NoteTagService struct {
	noteTagRepo IRepo.NoteTagRepository
}

func NewNoteTagService(repo IRepo.NoteTagRepository) NoteTagService {
	return NoteTagService{noteTagRepo: repo}
}

func (this NoteTagService) Create(tag *domain.NoteTag) *errors.AppError {
	tag.Id = helpers.NewUUID()
	err := this.noteTagRepo.Create(tag)
	if err != nil {
		return err
	}
	return nil
}

func (this NoteTagService) GetAll() ([]domain.NoteTag, *errors.AppError) {
	tags, err := this.noteTagRepo.GetAll()
	if err != nil {
		return nil, err
	}
	return tags, nil
}

func (this NoteTagService) Delete(id string) *errors.AppError {
	err := this.noteTagRepo.Delete(id)
	if err != nil {
		return err
	}
	return nil
}
