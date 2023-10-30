import { useEffect, useState } from "react";
import NoteList from "./NoteList/NoteList";
import useNotes from "../../../api/useNotes";
import { useAuth } from "../../../store/auth-context";
import { useParams, useSearchParams } from "react-router-dom";

const Timeline = () => {
  const notesApi = useNotes();
  const [notes, setNotes] = useState([]);
  const userAuth = useAuth();
  const params = useParams();
  const [searchParams] = useSearchParams();

  function extractQueryParams(searchParams) {
    const queryParams = {};
    searchParams.forEach((value, key) => {
      if (key !== "search" && key !== "world") {
        queryParams[key] = value;
      }
    });

    return queryParams;
  }

  const fetchAndSetNotes = async () => {
    let fetchedNotes = [];
    if (searchParams.get("search") && searchParams.get("search") == "true") {
      const queryParams = extractQueryParams(searchParams);
      fetchedNotes = await notesApi.fetchNotesFilter(1, queryParams);
    } else {
      if (userAuth.isAuthenticated) {
        if (searchParams.get("world") && searchParams.get("world") == "true") {
          fetchedNotes = await notesApi.fetchNotes(1);
        } else {
          if (params.id) {
            fetchedNotes = await notesApi.fetchNotesByCommunity(1, params.id);
          } else {
            fetchedNotes = await notesApi.fetchNotesFeed(1);
          }
        }
      } else {
        alert("here");
        if (params.id) {
          fetchedNotes = await notesApi.fetchNotesByCommunity(1, params.id);
        } else {
          fetchedNotes = await notesApi.fetchNotes(1);
        }
      }
    }

    setNotes(fetchedNotes);
  };

  const setNotesHandler = (notes) => {
    fetchAndSetNotes(notes);
  };

  useEffect(() => {
    fetchAndSetNotes();
  }, [userAuth.isAuthenticated, searchParams, params.id]);

  return (
    <NoteList
      communityId={params.id}
      setNotesHandler={setNotesHandler}
      notes={notes}
    ></NoteList>
  );
};

export default Timeline;
