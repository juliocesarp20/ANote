import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import {
  AvatarAuthor,
  AvatarBackground,
  AvatarContainer,
  AvatarUsernames,
  ContentContainer,
  CustomAvatar,
  NotesCardContainer,
  StyledLink,
  Title,
} from "../NoteCard.styled";
import Tags from "../../../Tags/TagsList";

const ExpandedCard = ({ note, randomColorElement }) => {
  return (
    <NotesCardContainer>
      <CardContent>
        <Title variant='h7' component='div'>
          {note.Title}
        </Title>
        <AvatarBackground randomColor={randomColorElement}>
          <AvatarContainer>
            <CustomAvatar variant='square'>N</CustomAvatar>
          </AvatarContainer>
          <StyledLink to='/404'>
            <AvatarUsernames>
              <AvatarAuthor>{note.Author}</AvatarAuthor>
            </AvatarUsernames>
          </StyledLink>
        </AvatarBackground>
        <ContentContainer>
          <Typography color='textSecondary'>{note.Content}</Typography>
        </ContentContainer>
        <ContentContainer sx={{ marginTop: "10px" }}>
          <Tags tags={note.Tags}></Tags>
        </ContentContainer>
        <Typography color='textSecondary'>{note.PublishedDate}</Typography>
      </CardContent>
    </NotesCardContainer>
  );
};

const noteShape = PropTypes.shape({
  Id: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Content: PropTypes.string.isRequired,
  LikesCount: PropTypes.number.isRequired,
  Likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  PublishedDate: PropTypes.string.isRequired,
  UpdatedDate: PropTypes.string.isRequired,
  Author: PropTypes.string.isRequired,
  Tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  CommentCount: PropTypes.number.isRequired,
  Commenters: PropTypes.arrayOf(PropTypes.string).isRequired,
});

ExpandedCard.propTypes = {
  note: noteShape.isRequired,
  randomColorElement: PropTypes.func.isRequired,
};

export default ExpandedCard;
