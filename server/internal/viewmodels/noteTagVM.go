package viewmodels

type CreateNoteTagVM struct {
	Name string `json:"name"`
}

type NoteTagVM struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
