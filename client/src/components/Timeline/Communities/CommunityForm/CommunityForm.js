import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  InputLabel,
  Button,
  TextField,
} from "../../../../common/FormStyling.styled";
import PropTypes from "prop-types";
import { useModal } from "../../../../store/modal-context";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useAuth } from "../../../../store/auth-context";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  name: yup.string("Insira o nome").required("Nome é obrigatório"),
  image: yup.mixed().required("Insira uma imagem"),
});

const CommunityForm = ({ communities, setCommunitiesHandler }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const auth = useAuth();
  const [avatarPreview, setAvatarPreview] = useState("/avatars/default.png");
  const modal = useModal();
  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const communityData = new FormData();
      communityData.append("name", values.name);
      communityData.append("background", selectedFile);
      const createCommunity = async () => {
        const createdCommunity = await axios.post(
          "/communities",
          communityData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (createdCommunity) {
          const id = createdCommunity.data.data.id;
          communities.push(communityData);
          setCommunitiesHandler(communities);
          navigate("/communities/" + values.name + "?communityId=" + id);
        }
      };

      createCommunity();

      modal.closeModal();
    },
  });

  return (
    <>
      <Typography variant='h6' style={{ fontWeight: "bold" }}>
        Criar uma Comunidade
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputLabel htmlFor='name'>Nome</InputLabel>
        <TextField
          fullWidth
          id='name'
          name='name'
          placeholder='Insira o nome'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <Box
          display='flex'
          textAlign='center'
          justifyContent='center'
          flexDirection='column'
        >
          {selectedFile && (
            <div style={{ marginTop: "10px" }}>
              <img
                style={{
                  margin: "auto",
                  display: "block",
                  width: "250px",
                  height: "250px",
                }}
                size='md'
                src={avatarPreview}
              />
            </div>
          )}

          <Button
            variant='contained'
            component='label'
            startIcon={<CloudUploadIcon />}
          >
            Escolha uma imagem
            <input
              name='image'
              accept='image/*'
              id='contained-button-file'
              type='file'
              hidden
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                setSelectedFile(selectedFile);
                const fileReader = new FileReader();
                fileReader.onload = () => {
                  if (fileReader.readyState === 2) {
                    formik.setFieldValue("image", fileReader.result);
                    setAvatarPreview(fileReader.result);
                  }
                };
                fileReader.readAsDataURL(e.target.files[0]);
              }}
            />
          </Button>
        </Box>
        <Button variant='contained' fullWidth type='submit'>
          Criar Comunidade
        </Button>
      </form>
    </>
  );
};

CommunityForm.propTypes = {
  communities: PropTypes.array.isRequired,
  setCommunitiesHandler: PropTypes.func.isRequired,
};

export default CommunityForm;
