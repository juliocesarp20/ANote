package viewmodels

import "anote/internal/domain"

type CreateCommentVM struct {
	UserId  string `json:"user_id"`
	NoteId  string `json:"note_id"`
	Content string `json:"content"`
}

func (this *CreateCommentVM) ToDomainComment() domain.Comment {
	var comment domain.Comment
	comment.UserId =  this.UserId
	comment.NoteId =  this.NoteId
	comment.Content = this.Content
	return comment
}