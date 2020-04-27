import { useContext, useEffect, useCallback } from "react";
import { firebase } from "../../../utils/firebase";
import { store } from "../../../store";

const useCreateVisitorCenter = () => {
  const context = useContext(store);
  const {
    state: {
      auth: { uid },
      visitorCenter: {
        isCreatingVisitorCenter,
        visitorCenterData,
        isFetchingVisitorCenterData,
      },
      dodoCode: { isSettingDodoCode },
    },
    dispatch,
  } = context;

  const isAuthed = uid !== null && uid !== undefined;
  const isLoading =
    !isAuthed ||
    isCreatingVisitorCenter ||
    isSettingDodoCode ||
    isFetchingVisitorCenterData;

  const setDodoCode = async (uid, dodoCode) => {
    if (uid && dodoCode) {
      const db = firebase.firestore();

      dispatch({ type: "SET_DODO_CODE" });

      await db
        .collection("users")
        .doc(uid)
        .set({
          dodoCode,
          next: "",
        })
        .then(() => {
          dispatch({ type: "SET_DODO_CODE_SUCCESS" });
        })
        .catch((error) => {
          dispatch({ type: "SET_DODO_CODE_FAIL", error });
        });
    } else {
      dispatch({ type: "SET_DODO_CODE_FAIL", error: "Invalid dodo code" });
    }
  };

  const createVisitorCenter = async (uid, name, summary) => {
    if ((uid, name, summary)) {
      const db = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;

      dispatch({ type: "CREATE_VISITOR_CENTER" });

      await db
        .collection("centers")
        .doc(uid)
        .set({
          name,
          owner: uid,
          createdAt: timestamp(),
          waiting: [],
          summary,
        })
        .then(() => {
          dispatch({ type: "CREATE_VISITOR_CENTER_SUCCESS", centerId: uid });
        })
        .catch((error) => {
          dispatch({ type: "CREATE_VISITOR_CENTER_FAIL", error });
        });
    } else {
      dispatch({ type: "CREATE_VISITOR_CENTER_FAIL", error: "Invalid data" });
    }
  };

  const fetchVisitorCenterData = useCallback(
    (uid) => {
      if (uid) {
        dispatch({ type: "FETCH_VISITOR_CENTER" });

        return firebase
          .firestore()
          .collection("centers")
          .doc(uid)
          .get()
          .then((result) => {
            if (result.exists) {
              dispatch({
                type: "FETCH_VISITOR_CENTER_SUCCESS",
                data: result.data(),
              });
            } else {
              throw new Error("The user has not yet created a visitor center");
            }
          })
          .catch((error) => {
            dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error });
          });
      } else {
        dispatch({ type: "FETCH_VISITOR_CENTER_FAIL", error: "Invalid data" });
      }
    },
    [dispatch]
  );

  const handleCreateVisitorCenter = async (name, summary, dodoCode) => {
    await createVisitorCenter(uid, name, summary);
    await setDodoCode(uid, dodoCode);
    await fetchVisitorCenterData(uid);
  };

  useEffect(() => {
    isAuthed && fetchVisitorCenterData(uid);
  }, [isAuthed, uid, fetchVisitorCenterData]);

  return {
    handleCreateVisitorCenter,
    visitorCenterData,
    isLoading,
  };
};

export default useCreateVisitorCenter;
