import React, { useEffect, useRef, useState } from "react";
import { Typography, IconButton } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import {
  InputLabel,
  Button,
  TextField,
} from "../../../../common/FormStyling.styled";
import PropTypes from "prop-types";
import { useModal } from "../../../../store/modal-context";
import { CustomTextArea } from "../../TimelineForms.styled";
import AddIcon from "@mui/icons-material/Add";
import useNotes from "../../../../api/useNotes";
import InputAutocomplete from "../../../../common/InputAutoComplete";
import useTags from "../../../../api/useTags";
import listHandler from "../../../header/Search/SearchListHandler";
import Tags from "../../Tags/TagsList";

const validationSchema = yup.object({
  title: yup.string("Insira o título").required("Título é obrigatório"),
  description: yup
    .string("Insira a descrição")
    .required("Descrição é obrigatória"),
});

const NoteForm = ({ notes, communityId, setNotesHandler }) => {
  const notesApi = useNotes();
  const modal = useModal();
  const [tagList, setTagList] = useState([]);
  const [tags, setTags] = useState([]);
  const tagsApi = useTags();
  const { addToList, removeFromList } = listHandler(setTagList);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      let fetchedTags = await tagsApi.fetchTags();
      fetchedTags = fetchedTags.map((item) => item.Tags);
      setTags(fetchedTags);
    };
    fetchTags();
  }, []);

  const handleButtonClick = () => {
    addToList(inputValue);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let communities;
      if (communityId) {
        communities = [communityId];
      } else {
        communities = [];
      }
      const postTags = async (tags) => {
        let tagIds = [];
        try {
          const tagPromises = tags.map(async (tag) => {
            const tagPost = {
              name: tag,
            };
            const tagResponse = await tagsApi.createTag(tagPost); // Await the promise
            console.log(tagResponse.data.id);
            tagIds.push(tagResponse.data.id);
          });

          await Promise.all(tagPromises); // Wait for all promises to complete
          console.log("Successfully posted tags:", tagIds);
          return tagIds;
        } catch (error) {
          console.error("Error posting tags:", error);
          throw error;
        }
      };

      const postNotes = async (notes) => {
        const postedTags = await postTags(tagList);
        if (postedTags) {
          const note = {
            title: values.title,
            content: values.description,
            tags: postedTags,
            communities: communities,
          };
          const fetchedNotes = await notesApi.createNote(note);
          if (fetchedNotes) {
            if (notes) {
              notes.push(fetchedNotes);
            } else {
              notes = [];
              notes.push(fetchedNotes);
            }
            setNotesHandler(notes);
          }
        }
      };
      postNotes(notes);
      modal.closeModal();
    },
  });

  return (
    <>
      <FormikProvider value={formik}>
        <Typography variant='h6' style={{ fontWeight: "bold" }}>
          Criar uma Nota
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <InputLabel htmlFor='title'>Título</InputLabel>
          <TextField
            fullWidth
            id='title'
            name='title'
            placeholder='Insira o título'
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <InputLabel htmlFor='description'>Descrição</InputLabel>
          <CustomTextArea
            id='description'
            name='description'
            placeholder='Insira a descrição'
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            {...(formik.touched.description && formik.errors.description
              ? { error: "true" }
              : {})}
            minRows={4}
          />
          <InputLabel htmlFor='tags'>Tags</InputLabel>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <InputAutocomplete
              addToList={addToList}
              name='tag'
              id='tag'
              options={tags}
              list={tagList}
              setInputValue={setInputValue}
            />
            <IconButton
              onClick={handleButtonClick}
              style={{ marginLeft: "5px" }}
            >
              <AddIcon />
            </IconButton>
          </div>
          <Tags
            tags={tagList}
            hasLink={false}
            hasDelete={true}
            deletionHandler={removeFromList}
          ></Tags>
          <Button variant='contained' fullWidth type='submit'>
            Criar Nota
          </Button>
        </form>
      </FormikProvider>
    </>
  );
};

NoteForm.propTypes = {
  notes: PropTypes.array.isRequired,
  communityId: PropTypes.any,
  setNotesHandler: PropTypes.func.isRequired,
};

export default NoteForm;
