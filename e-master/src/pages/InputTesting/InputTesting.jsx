import React, { useState, useEffect } from "react";
import "./InputTesting.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { FaRegSmileBeam, FaRegThumbsUp, FaRegSadTear } from "react-icons/fa";


const InputTesting = () => {
  const [testsData, setTestsData] = useState({});
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testContent, setTestContent] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Tải danh sách test (tests.json)
  useEffect(() => {
    const loadTestsData = async () => {
      try {
        const res = await fetch("/data/tests.json");
        if (!res.ok) throw new Error("Không thể tải file tests.json");
        const data = await res.json();
        setTestsData(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải tests.json:", err);
        setError("Không thể tải danh sách bài test.");
      }
    };
    loadTestsData();
  }, []);

  // ✅ Chọn kỹ năng
  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setSelectedTest(null);
    setTestContent(null);
    setUserAnswers({});
    setScore(null);
  };

  // ✅ Chọn test
  const handleTestClick = async (test) => {
    setSelectedTest(test.name);
    setLoading(true);
    setError("");
    setScore(null);
    setUserAnswers({});

    try {
      const res = await fetch(`/data/${test.file}`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu bài test này.");
      const data = await res.json();
      setTestContent(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải test:", err);
      setError("Không thể tải nội dung test.");
      setTestContent(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Lưu đáp án người dùng
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // ✅ Nộp bài và chấm điểm
  const handleSubmit = () => {
    if (!testContent?.questions) return;

    let correct = 0;
    testContent.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct) correct++;
    });

    const total = testContent.questions.length;
    setScore({ correct, total });
  };

  // ✅ Giao diện hiển thị test
  if (testContent) {
    return (
      <div className="input-testing-page">
        <Navbar />
        <div className="main-layout">
          <Sidebar />
          <main className="test-content">
            <h2>
              {selectedSkill.toUpperCase()} - {selectedTest}
            </h2>

            <button className="back-btn" onClick={() => setTestContent(null)}>
              ← Back to {selectedSkill}
            </button>

            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}

{testContent.questions?.map((q, index) => (
  <div key={index} className="question-item">
    <p>
      <strong>Question {index + 1}:</strong> {q.question}
    </p>

    <form className="options-form">
      {q.options.map((opt, i) => (
        <label
          key={i}
          className={`option-item ${
            userAnswers[index] === i ? "selected-answer" : ""
          }`}
        >
          <input
            type="radio"
            name={`question-${index}`}
            value={i}
            checked={userAnswers[index] === i}
            onChange={() => handleAnswerSelect(index, i)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </form>
  </div>
))}


            <button className="submit-btn" onClick={handleSubmit}>
              Submit Test
            </button>

            {score && (
             <div className="score-box">
  <h3>
    {score.correct === score.total ? (
      <>
        <FaRegSmileBeam className="score-icon success" />
        You got {score.correct}/{score.total} correct!
      </>
    ) : score.correct > score.total / 2 ? (
      <>
        <FaRegThumbsUp className="score-icon medium" />
        You got {score.correct}/{score.total} correct!
      </>
    ) : (
      <>
        <FaRegSadTear className="score-icon fail" />
        You got {score.correct}/{score.total} correct!
      </>
    )}
  </h3>

  <p>
    {score.correct === score.total
      ? "Excellent!"
      : score.correct > score.total / 2
      ? "Good job!"
      : "Keep practicing!"}
  </p>
</div>

            )}
          </main>
        </div>
      </div>
    );
  }

  // ✅ Giao diện chọn kỹ năng và test
  return (
    <div className="input-testing-page">
      <Navbar />
      <div className="main-layout">
        <Sidebar />
        <main className="test-container">
          <h2>Choose Your Placement Test</h2>

          {error && <p className="error">{error}</p>}
          {loading && <p>Loading...</p>}

          <div className="skill-options">
            <h3>Select skill to test</h3>
            {["listening", "reading", "writing", "speaking", "full"].map(
              (skill) => (
                <button
                  key={skill}
                  className={selectedSkill === skill ? "active" : ""}
                  onClick={() => handleSkillClick(skill)}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </button>
              )
            )}
          </div>

          {selectedSkill && (
            <div className="test-options">
              <h3>
                Select test for{" "}
                <span className="highlight">
                  {selectedSkill.charAt(0).toUpperCase() +
                    selectedSkill.slice(1)}
                </span>
              </h3>

              <div className="test-list">
                {testsData[selectedSkill]?.length > 0 ? (
                  testsData[selectedSkill].map((test, index) => (
                    <button key={index} onClick={() => handleTestClick(test)}>
                      {test.name}
                    </button>
                  ))
                ) : (
                  <p>No tests found for this skill.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InputTesting;
