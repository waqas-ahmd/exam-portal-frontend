import React from "react";
// import Divider from "../../Components/Divider";

const TeacherTutorial = () => {
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
            src="https://www.youtube.com/embed/xJCS2k5SsnE"
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
          <h5>Question Bank Page</h5>
          <div>
            The question bank page shows a list of all the question that you
            create. Using first time there will be no question. You can add one
            by clicking on the 'Add New Question' Button.
          </div>
        </TutorialStep>
        <TutorialStep>
          <h5>Adding New Question</h5>
          <div>
            On clicking the Add new Question a pop up window will appeaer.
            Select the grade, subject, syllabus and question type for your
            question and click on 'Next' button.
            <br />
            Now enter the question statement or upload an image for the
            question.If adding a multiple choice question, don't forget to
            mention the correct answer by clicking on the one of the circles
            with A,B,C,D or E with the right option. Once done click on the
            submit button and the question will be added to the list.
            <br />
            You can edit or delete the question.
            <Divider />
            <em>
              <b>Tip: </b>
              If you want to add multiple questions for the same grade,subject
              and syllabus, select those filters from the top of the page. So
              you don't have to select those options in the pop up window every
              time you add a new question.
            </em>
          </div>
        </TutorialStep>
        <TutorialStep>
          <h5>Creating an Exam</h5>
          <div>
            On dashboard page, click on the 'Create Exam' button. Next, choose a
            title, select the options (grade,subject and syllabus) and time
            duration for the Exam. Click on 'Next' and on the next page you can
            select questions from the question bank for the exam. <br />
            There are two sections on this page. The questions available in the
            question bank. And the questions selected for the exam.Once added to
            the selected questions section, you can mention the marks to each of
            the question.
            <br />
            If you want to add more questions to bank at the time of creating
            exam, you can do it by clicking on the 'Add new Question' button, a
            page will open you can add the questions there. After creating the
            Questions On the exam create page click on refresh button to see the
            newly created questions.
            <br />
            To submit the exam, click on the Submit button. After the submission
            is done, you will be redirected to the exams page, with a list of
            exams created by you, the latest at the top. The list item will show
            the exam title and exam code that the students will use to attempt
            the exam.
          </div>
        </TutorialStep>
        <TutorialStep>
          <h5>View and Mark Exams</h5>
          <div>
            There is an exams list page, where the all the exams, you have
            created, are displayed. Clicking on the exam will redirect you to a
            new page where you can see the exam details, questions and the
            attempted exam answers submitted by the students. You can click on
            each attempt, a pop up will appear with the answers and input fields
            for the marks. You only have to give marks for the short answers.
            MCQs are checked automatically.
          </div>
        </TutorialStep> 
      </div> */}
    </div>
  );
};

export default TeacherTutorial;

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
