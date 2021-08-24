import React from "react";

const StudentTutorial = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <h2 className="p-text mt-3">TUTORIAL</h2>

      <div style={{ width: "95%", padding: 5 }}>
        {/* <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "calc(658 / 1366 * 100%)",
            borderRadius: 15,
            overflow: "hidden",
            boxShadow: "0px 0px 8px #666",
          }}
        >
          <iframe
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0px",
            }}
            src="https://www.youtube.com/embed/I9vMwp5sqCc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;fullscreen"
            allowfullscreen
          ></iframe>
        </div> */}
      </div>

      {/* <div style={{ width: "100%" }}>
        <TutorialStep>
          <h5>Login / Register</h5>
          <div>
            Register a new acoount. You can Sign up using either email address
            or using your Google account. After logging in you will be
            redirected to the dashboard page.
          </div>
        </TutorialStep>

        <TutorialStep>
          <h5>Adding Exam</h5>
          <div>
            Go to the exams list page and click on 'Add New Exam' button. A pop
            up will appear asking for the exam code, that is provided by your
            instructor to you. Enter it and the exam will be added to your list.
          </div>
        </TutorialStep>
        <TutorialStep>
          <h5>Attempting Exam</h5>
          <div>
            On exam list page click on the exam you want to attempt. A page will
            open showing the title, duration of the exam. There is button to
            start the exam. Once you click it, exam will start in 5 seconds and
            the questions will load. Within 5 seconds you can cancel the exam,
            if you want to attempt it later. Once exam is started, timer will
            show up at the bottom right. Make sure to submit the exam before the
            time runs out.
            <br />
            When you submit the exam, the marks for the MCQs will immediately
            show. The marks for the short questions will be submitted by your
            instructor, and you will be notified by an email.
          </div>
        </TutorialStep>
      </div> */}
    </div>
  );
};

// const TutorialStep = ({ children }) => {
//   return (
//     <div
//       className="p-text"
//       style={{
//         padding: 10,
//         margin: "8px 0px",
//         width: "100%",
//         backgroundColor: "#3ad8",
//         textAlign: "justify",
//         borderRadius: 4,
//       }}
//     >
//       {children}
//     </div>
//   );
// };

export default StudentTutorial;
