import React, { useRef } from "react";
import { useCreateVisitorCenter } from "./hooks";

const CreateVisitorCenter = () => {
  const {
    isCreatingCenter,
    handleCreateVisitorCenter,
    visitorCenterData,
    isFetchingVisitorCenter,
  } = useCreateVisitorCenter();

  let nameRef = useRef();
  let summaryRef = useRef();
  let codeRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let name = event.target.name.value;
    let summary = event.target.summary.value;
    let code = event.target.code.value;

    nameRef.current.value = "";
    summaryRef.current.value = "";
    codeRef.current.value = "";

    handleCreateVisitorCenter(name, summary, code);
  };

  const url =
    visitorCenterData &&
    `${window.location.origin}/center/${visitorCenterData?.owner}`;

  return (
    <>
      {isFetchingVisitorCenter || visitorCenterData === undefined ? (
        <div>Loading...</div>
      ) : (
        <>
          {visitorCenterData ? (
            <div>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Go to your visitor center
              </a>
            </div>
          ) : (
            <>
              <h2>Create visitor center</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name</label>
                  <br />
                  <input
                    type="text"
                    id="name"
                    required
                    ref={nameRef}
                    maxLength="30"
                  />
                </div>

                <div>
                  <label htmlFor="code">Dodo code</label>
                  <br />
                  <input
                    type="text"
                    id="code"
                    name="code"
                    required
                    ref={codeRef}
                    maxLength="5"
                    minLength="5"
                  />
                </div>

                <div>
                  <label htmlFor="summary">Summary</label>
                  <br />
                  <textarea
                    id="summary"
                    name="summary"
                    required
                    ref={summaryRef}
                    rows="5"
                    maxLength="1000"
                  />
                </div>
                <div>
                  <button type="submit" disabled={isCreatingCenter}>
                    Create visitor center
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </>
  );
};

export default CreateVisitorCenter;
