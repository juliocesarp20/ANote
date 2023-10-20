package repositories

import (
	"anote/internal/domain"
	"anote/internal/errors"
	"anote/internal/helpers"
	"anote/internal/interfaces"
	"log"
	"reflect"
)

type NoteRepository struct{ DBConn interfaces.DBConnection }

func NewNoteRepository(DBConn interfaces.DBConnection) NoteRepository {
	return NoteRepository{
		DBConn: DBConn,
	}
}

func (this NoteRepository) Create(note *domain.Note) *errors.AppError {
	err := this.DBConn.Exec(
		"INSERT INTO notes (id, title, author_id, content) VALUES ($1, $2, $3, $4)",
		note.Id,
		note.Title,
		note.AuthorID,
		note.Content,
	)
	if err != nil {
		log.Println("[NoteRepo] Error on insert new note:", err)
		return err
	}
	return nil
}

func (this NoteRepository) AddTags(noteId string, tagIds []string) *errors.AppError {
	for _, tagId := range tagIds {
		err := this.DBConn.Exec(
			"INSERT INTO note_tags (id, note_id, tag_id) VALUES ($1, $2, $3)",
			helpers.NewUUID(),
			noteId,
			tagId,
		)
		if err != nil {
			log.Println("[NoteRepo] Error on add tag to note:", err)
			return err
		}
	}
	return nil
}

func (this NoteRepository) RemoveTags(noteId string, tagIds []string) *errors.AppError {
	for _, tagId := range tagIds {
		err := this.DBConn.Exec(
			"DELETE FROM note_tags WHERE note_id = $1 AND tag_id = $2",
			noteId,
			tagId,
		)
		if err != nil {
			log.Println("[NoteRepo] Error on remove tag from note:", err)
			return err
		}
	}
	return nil
}

func (this NoteRepository) GetByID(id string) (*domain.Note, *errors.AppError) {
	objType := reflect.TypeOf(domain.Note{})
	res, err := this.DBConn.QueryOne(objType, "SELECT * FROM notes WHERE id = $1", id)
	if err != nil {
		log.Println("[NoteRepo] Error on get note by id:", id, "err:", err)
		return nil, err
	}
	if res == nil {
		return nil, nil
	}

	if note, ok := res.(domain.Note); ok {
		return &note, nil
	}
	return nil, nil
}

func (this NoteRepository) Update(note *domain.Note) *errors.AppError {
	err := this.DBConn.Exec(
		"UPDATE notes SET title = $1, content = $2 WHERE id = $3",
		note.Title,
		note.Content,
		note.Id,
	)

	if err != nil {
		log.Println("[NoteRepo] Error on update note:", err)
		return err
	}
	return nil
}

func (this NoteRepository) Delete(username string) *errors.AppError {
	err := this.DBConn.Exec("DELETE FROM notes WHERE id = $1", username)
	if err != nil {
		log.Println("[NoteRepo] Error on delete note:", err)
		return err
	}
	return nil
}
