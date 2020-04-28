import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useWaitingList } from "./hooks";
import moment from "moment";
import {
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Box,
  Chip,
} from "@material-ui/core";
import { Person as PersonIcon, FlightTakeoff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonMarginRight: {
    marginRight: theme.spacing(1),
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));
const WaitingList = () => {
  const { id: centerId } = useParams();
  const {
    uid,
    handleDeleteUser,
    isOwner,
    joinVisitorQueue,
    isVisitorCenterOpen,
    userAlreadyInQueue,
    waitingList,
  } = useWaitingList(centerId);
  const classes = useStyles();

  const nameInputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    nameInputRef.current.value = "";

    if (name && centerId && !userAlreadyInQueue) {
      joinVisitorQueue(centerId, name);
    }
  };

  const positionInQueue =
    waitingList && waitingList.findIndex((user) => user?.uid === uid) + 1;

  return (
    <>
      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Join visitor queue</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            label="Name"
            inputRef={nameInputRef}
            id="name"
            required
            maxLength="30"
            inputProps={{ maxLength: "30" }}
            variant="outlined"
            margin="dense"
            disabled={isOwner || userAlreadyInQueue || !isVisitorCenterOpen}
          />
          <br />
          <Box mt={1} mb={1}>
            <Button
              className={classes.buttonMarginRight}
              variant="contained"
              color="primary"
              size="small"
              type="submit"
              disabled={isOwner || userAlreadyInQueue || !isVisitorCenterOpen}
            >
              Join queue
            </Button>
            {userAlreadyInQueue && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDeleteUser(centerId, uid)}
              >
                Leave
              </Button>
            )}
          </Box>
          {(isOwner || userAlreadyInQueue) && (
            <Typography>Position #{positionInQueue}</Typography>
          )}
        </form>
      </Paper>

      <Paper elevation={0} variant="outlined" className={classes.paper}>
        <Typography variant="h2">Waiting list</Typography>

        {!waitingList ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {waitingList?.length > 0 ? (
              <List dense>
                {waitingList.map(({ name, joinedAt, uid: userId }, index) => {
                  const date = moment(joinedAt.toDate()).calendar();
                  return (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        {index === 0 ? <FlightTakeoff /> : <PersonIcon />}
                      </ListItemAvatar>
                      <ListItemText
                        primary={`#${index + 1} ${name}`}
                        secondary={`Joined: ${date}`}
                      />
                      {index === 0 ? (
                        <Chip color="primary" size="small" label="Next" />
                      ) : (
                        <Chip size="small" label="Please wait..." />
                      )}
                      {isOwner && index === 0 && (
                        <Box ml={1}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleDeleteUser(centerId, userId)}
                          >
                            Done
                          </Button>
                        </Box>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography>Visitor center is empty</Typography>
            )}
          </>
        )}
      </Paper>
    </>
  );
};

export default WaitingList;
