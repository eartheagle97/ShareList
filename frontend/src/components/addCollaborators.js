import React, { useState } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PropTypes from "prop-types";
import {
  Button,
  Backdrop,
  Box,
  Modal,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { useSpring, animated } from "@react-spring/web";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "../services/api";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddCollaborators = ({
  shoppingList,
  setShoppingList,
  collaborator,
  setCollaborator,
  setAlertMessage,
}) => {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddUser = async () => {
    await axios
      .put(`/api/shopping-lists/collaborators/${shoppingList._id}`, {
        userEmail: userEmail,
        currentUser: shoppingList.user,
      })
      .then((response) => {
        const { updatedShoppingList, collabUser, message } = response.data;
        setAlertMessage({
          open: true,
          message: message,
          type: "success",
        });
        setUserEmail("");
        setShoppingList(updatedShoppingList);
        setCollaborator(collabUser);
      })
      .catch((error) => {
        setAlertMessage({
          open: true,
          message: error.response.data.error,
          type: "error",
        });
      });
  };

  const handleCollabDelete = async (CollabUserID) => {
    await axios
      .delete(
        `/api/shopping-lists/collaborators/${shoppingList._id}/${CollabUserID}`
      )
      .then((response) => {
        const { updatedShoppingList, collabUser, message } = response.data;
        setAlertMessage({
          open: true,
          message: message,
          type: "error",
        });
        setShoppingList(updatedShoppingList);
        setCollaborator(collabUser);
      });
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        component="label"
        variant="contained"
        color="secondary"
        startIcon={<GroupAddIcon />}
        sx={{ mb: 2 }}
      >
        Add Collaborators
      </Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent={"space-between"}
              sx={{ mb: 2 }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{ fontWeight: 600, textTransform: "uppercase" }}
                >
                  Add Collaborators
                </Typography>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Email"
                  name="email"
                  value={userEmail}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
            <Grid sx={{ mb: 4 }}>
              <Typography variant="body1">
                {collaborator && collaborator.length > 0
                  ? "List of User"
                  : "No User Added"}
              </Typography>
              <List>
                {collaborator && collaborator.length > 0
                  ? collaborator.map((collabUser, index) => {
                      return (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleCollabDelete(collabUser._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                          sx={{ p: "8px 0px" }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={collabUser.firstName}
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              collabUser.firstName + " " + collabUser.lastName
                            }
                            secondary={collabUser.email}
                          />
                        </ListItem>
                      );
                    })
                  : ""}
              </List>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AddCollaborators;
