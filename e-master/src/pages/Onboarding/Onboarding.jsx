
import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from '@google/genai';

// --- TYPES ---
const TestType = {
  NONE: 'NONE',
  IELTS: 'IELTS',
  TOEIC: 'TOEIC',
  BOTH: 'BOTH',
};

const SkillLevel = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

// --- CONSTANTS ---
const LEARNING_PREFERENCES = [
  'Practice Tests',
  'Vocabulary Building',
  'Grammar Drills',
  'Watching Videos',
  'Reading Articles',
  'Speaking with Partners',
  'Writing Essays',
];

// --- GEMINI SERVICE ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(userData) {
    let testInfo = '';
    if (userData.testType === 'IELTS') {
        testInfo = `The user is preparing for the IELTS exam with a target band score of ${userData.ieltsTarget}.`;
    } else if (userData.testType === 'TOEIC') {
        testInfo = `The user is preparing for the TOEIC exam with a target score of ${userData.toeicTarget}.`;
    } else {
        testInfo = `The user is preparing for both the IELTS (target: ${userData.ieltsTarget}) and TOEIC (target: ${userData.toeicTarget}) exams.`;
    }

    const writingSpeakingSkills = (userData.testType === 'IELTS' || userData.testType === 'BOTH') 
        ? `Writing: ${userData.skills.writing}, Speaking: ${userData.skills.speaking}.`
        : '';

    return `
      You are an expert language learning coach specializing in IELTS and TOEIC. 
      Create a detailed, personalized 4-week study plan based on the following user profile.

      User Profile:
      - Goal: ${testInfo}
      - Current self-assessed skills: Listening: ${userData.skills.listening}, Reading: ${userData.skills.reading}. ${writingSpeakingSkills}
      - Weekly time commitment: ${userData.weeklyHours} hours.
      - Preferred learning methods: ${userData.preferences.join(', ')}.

      Instructions:
      1. Generate a structured 4-week study plan.
      2. For each week, provide a brief summary of the week's focus.
      3. For each week, provide a daily breakdown of tasks for Monday to Friday. Weekends should be for review or rest.
      4. Each task must be specific, actionable, and tailored to the user's goals and skill levels.
      5. The total weekly study time should be realistically achievable within the user's committed ${userData.weeklyHours} hours.
      6. Focus on improving weaker areas while maintaining strengths.
      7. Incorporate the user's preferred learning methods.
      8. Return the response ONLY as a valid JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json.
    `;
}

const generateStudyPlan = async (userData) => {
    const prompt = buildPrompt(userData);
    
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        weeklyPlan: {
          type: Type.ARRAY,
          description: "A 4-week study plan.",
          items: {
            type: Type.OBJECT,
            properties: {
              week: { type: Type.INTEGER, description: "The week number (1-4)." },
              focus: { type: Type.STRING, description: "The main focus of the week." },
              dailyTasks: {
                type: Type.ARRAY,
                description: "A list of tasks for each day of the week.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING, description: "The day of the week." },
                    tasks: {
                      type: Type.ARRAY,
                      description: "A list of specific tasks for the day.",
                      items: { type: Type.STRING }
                    }
                  },
                  required: ['day', 'tasks']
                }
              }
            },
            required: ['week', 'focus', 'dailyTasks']
          }
        }
      },
      required: ['weeklyPlan']
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText);
        return plan;
    } catch (error) {
        console.error("Error generating study plan:", error);
        throw new Error("Failed to generate study plan from AI model.");
    }
};

// --- COMPONENTS ---

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
    </div>
  );
};

const StepContainer = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextText = 'Next',
  isNextDisabled = false,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full transition-all duration-500 ease-in-out transform animate-fade-in">
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm font-medium text-primary-600">
          Step {currentStep} of {totalSteps}
        </p>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">{title}</h1>
        <p className="text-gray-500 mt-2">{subtitle}</p>
      </div>

      <div className="space-y-6">{children}</div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        {onBack ? (
          <button
            onClick={onBack}
            className="py-2 px-4 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
        ) : (
          <div></div> // Placeholder for alignment
        )}
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:bg-primary-300 disabled:cursor-not-allowed disabled:transform-none"
        >
          {nextText}
        </button>
      </div>
    </div>
  );
};

const WelcomeStep = ({ onNext }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full transform transition-all duration-500 ease-in-out animate-fade-in">
       <div className="mb-6">
        <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
            E-Master
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Your AI English Test Planner</h1>
      <p className="text-gray-500 mt-4 max-w-md mx-auto">
        Ready to ace the IELTS or TOEIC? Let's build a personalized study plan that fits your goals, schedule, and learning style.
      </p>
      <div className="mt-8">
        <button
          onClick={onNext}
          className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
        >
          Let's Get Started
        </button>
      </div>
    </div>
  );
};

const GoalStep = ({ data, updateData, onNext, currentStep, totalSteps }) => {
    const goals = [
      { id: TestType.IELTS, name: 'IELTS', description: 'Academic & General Training' },
      { id: TestType.TOEIC, name: 'TOEIC', description: 'Listening & Reading' },
      { id: TestType.BOTH, name: 'Both', description: 'Prepare for IELTS & TOEIC' },
    ];

  return (
    <StepContainer
      title="What's Your Goal?"
      subtitle="Select the exam you are preparing for."
      onNext={onNext}
      currentStep={currentStep}
      totalSteps={totalSteps}
      isNextDisabled={data.testType === TestType.NONE}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => updateData({ testType: goal.id })}
            className={`p-6 text-left border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              data.testType === goal.id
                ? 'bg-primary-50 border-primary-500 shadow-md'
                : 'bg-white border-gray-200 hover:border-primary-400'
            }`}
          >
            <h3 className="text-lg font-bold text-gray-800">{goal.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
          </button>
        ))}
      </div>
    </StepContainer>
  );
};

const ScoreStep = ({ data, updateData, onNext, onBack, currentStep, totalSteps }) => {
  const showIELTS = data.testType === TestType.IELTS || data.testType === TestType.BOTH;
  const showTOEIC = data.testType === TestType.TOEIC || data.testType === TestType.BOTH;

  return (
    <StepContainer
      title="Set Your Target Scores"
      subtitle="What scores are you aiming for? Be ambitious but realistic!"
      onNext={onNext}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="space-y-6">
        {showIELTS && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <label htmlFor="ielts-score" className="block text-lg font-bold text-gray-800">
              IELTS Target Band
            </label>
            <p className="text-sm text-gray-500 mb-4">Typically from 1.0 to 9.0.</p>
            <div className="flex items-center gap-4">
              <input
                id="ielts-score"
                type="range"
                min="1.0"
                max="9.0"
                step="0.5"
                value={data.ieltsTarget}
                onChange={(e) => updateData({ ieltsTarget: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-bold text-lg text-primary-600 w-16 text-center bg-primary-100 rounded-md py-1">
                {data.ieltsTarget.toFixed(1)}
              </span>
            </div>
          </div>
        )}
        {showTOEIC && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <label htmlFor="toeic-score" className="block text-lg font-bold text-gray-800">
              TOEIC Target Score
            </label>
            <p className="text-sm text-gray-500 mb-4">Listening & Reading total score, from 10 to 990.</p>
             <div className="flex items-center gap-4">
              <input
                id="toeic-score"
                type="range"
                min="10"
                max="990"
                step="5"
                value={data.toeicTarget}
                onChange={(e) => updateData({ toeicTarget: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-bold text-lg text-primary-600 w-20 text-center bg-primary-100 rounded-md py-1">
                {data.toeicTarget}
              </span>
            </div>
          </div>
        )}
      </div>
    </StepContainer>
  );
};

const SkillSelector = ({ label, value, onChange }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-800">{label}</h3>
    <div className="flex justify-center sm:justify-start space-x-2 mt-2">
      {Object.values(SkillLevel).map((level) => (
        <button
          key={level}
          onClick={() => onChange(level)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            value === level
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
);

const SkillStep = ({ data, updateData, onNext, onBack, currentStep, totalSteps }) => {
  const showProductiveSkills = data.testType === TestType.IELTS || data.testType === TestType.BOTH;

  const handleSkillChange = (skill, value) => {
    updateData({
      skills: {
        ...data.skills,
        [skill]: value,
      },
    });
  };

  return (
    <StepContainer
      title="Assess Your Skills"
      subtitle="Be honest about your current abilities in each area."
      onNext={onNext}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="space-y-6">
        <SkillSelector label="Listening" value={data.skills.listening} onChange={(v) => handleSkillChange('listening', v)} />
        <SkillSelector label="Reading" value={data.skills.reading} onChange={(v) => handleSkillChange('reading', v)} />
        {showProductiveSkills && (
          <>
            <SkillSelector label="Writing" value={data.skills.writing} onChange={(v) => handleSkillChange('writing', v)} />
            <SkillSelector label="Speaking" value={data.skills.speaking} onChange={(v) => handleSkillChange('speaking', v)} />
          </>
        )}
      </div>
    </StepContainer>
  );
};

const TimeStep = ({ data, updateData, onNext, onBack, currentStep, totalSteps }) => {
  return (
    <StepContainer
      title="Your Study Commitment"
      subtitle="How many hours per week can you dedicate to studying?"
      onNext={onNext}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <div className="p-4 border border-gray-200 rounded-lg">
        <label htmlFor="weekly-hours" className="block text-lg font-bold text-gray-800">
          Hours per Week
        </label>
        <div className="flex items-center gap-4 mt-4">
          <input
            id="weekly-hours"
            type="range"
            min="1"
            max="40"
            step="1"
            value={data.weeklyHours}
            onChange={(e) => updateData({ weeklyHours: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="font-bold text-lg text-primary-600 w-24 text-center bg-primary-100 rounded-md py-1">
            {data.weeklyHours} hrs
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
            Consistency is key. Even a few focused hours each week can make a big difference!
        </p>
      </div>
    </StepContainer>
  );
};

const PreferenceStep = ({ data, updateData, onNext, onBack, currentStep, totalSteps }) => {
  const togglePreference = (preference) => {
    const currentPreferences = data.preferences;
    if (currentPreferences.includes(preference)) {
      updateData({ preferences: currentPreferences.filter((p) => p !== preference) });
    } else {
      updateData({ preferences: [...currentPreferences, preference] });
    }
  };

  return (
    <StepContainer
      title="How Do You Like to Learn?"
      subtitle="Select your favorite study methods. This helps us tailor your plan."
      onNext={onNext}
      onBack={onBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      nextText="Generate My Plan"
      isNextDisabled={data.preferences.length === 0}
    >
      <div className="flex flex-wrap gap-3">
        {LEARNING_PREFERENCES.map((pref) => (
          <button
            key={pref}
            onClick={() => togglePreference(pref)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2 ${
              data.preferences.includes(pref)
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:text-primary-600'
            }`}
          >
            {pref}
          </button>
        ))}
      </div>
    </StepContainer>
  );
};

const TaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WeekAccordion = ({ weekPlan, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <div className="bg-white border border-gray-200 rounded-lg mb-4 shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
            >
                <div className="flex items-center">
                    <span className="text-xl font-bold text-primary-600 mr-4">Week {weekPlan.week}</span>
                    <span className="text-gray-600 font-medium">{weekPlan.focus}</span>
                </div>
                <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {weekPlan.dailyTasks.map(dayPlan => (
                            <div key={dayPlan.day} className="bg-primary-50 p-4 rounded-lg">
                                <h4 className="font-bold text-primary-800 mb-2">{dayPlan.day}</h4>
                                <ul className="space-y-2">
                                    {dayPlan.tasks.map((task, i) => (
                                        <li key={i} className="flex items-start text-gray-700 text-sm">
                                            <TaskIcon/>
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PlanDisplay = ({ plan, onStartOver }) => {
  const [isCopied, setIsCopied] = useState(false);

  const generateEmailBody = (plan) => {
    let body = "Here is my AI-generated English study plan:\n\n";
    plan.weeklyPlan.forEach(week => {
      body += `--- WEEK ${week.week}: ${week.focus} ---\n`;
      week.dailyTasks.forEach(day => {
        body += `${day.day}:\n`;
        day.tasks.forEach(task => {
          body += `  - ${task}\n`;
        });
      });
      body += "\n";
    });
    return encodeURIComponent(body);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("My AI-Generated English Study Plan");
    const body = generateEmailBody(plan);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    try {
      const planString = JSON.stringify(plan);
      const base64Plan = btoa(planString);
      const url = `${window.location.origin}${window.location.pathname}?plan=${base64Plan}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      alert("Could not copy link to clipboard.");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full transform transition-all duration-500 ease-in-out animate-fade-in">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Your Personalized 4-Week Study Plan</h1>
            <p className="text-gray-500 mt-2">Here is your tailored roadmap to success. Good luck!</p>
        </div>
        
        <div>
            {plan.weeklyPlan.map((week, index) => (
                <WeekAccordion key={week.week} weekPlan={week} initialOpen={index === 0} />
            ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
            <button
                onClick={onStartOver}
                className="bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
                Create a New Plan
            </button>
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Share Your Plan</h3>
                <div className="flex justify-center items-center gap-4">
                    <button onClick={handleShareEmail} className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>Email</span>
                    </button>
                    <button onClick={handleCopyLink} className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50" disabled={isCopied}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a.5.5 0 01.708-.708l1.5 1.5a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                           <path fillRule="evenodd" d="M3.586 11.586a2 2 0 010-2.828l3-3a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a.5.5 0 01.708-.708l1.5 1.5a1 1 0 001.414 0l3-3a.5.5 0 01.708.708l-3 3a2 2 0 01-2.828 0z" clipRule="evenodd" />
                        </svg>
                        <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};


// --- MAIN APP ---
const TOTAL_STEPS = 6;

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    testType: TestType.NONE,
    ieltsTarget: 7.0,
    toeicTarget: 900,
    skills: {
      listening: SkillLevel.INTERMEDIATE,
      reading: SkillLevel.INTERMEDIATE,
      writing: SkillLevel.INTERMEDIATE,
      speaking: SkillLevel.INTERMEDIATE,
    },
    weeklyHours: 5,
    preferences: [],
  });

  const [studyPlan, setStudyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const planData = urlParams.get('plan');
      if (planData) {
        const decodedPlan = JSON.parse(atob(planData));
        if (decodedPlan && decodedPlan.weeklyPlan) { // Basic validation
          setStudyPlan(decodedPlan);
          setStep(TOTAL_STEPS + 1);
        }
      }
    } catch (e) {
      console.error("Failed to load plan from URL", e);
    }
  }, []); // Empty dependency array means this runs once on mount

  const updateUserData = useCallback((data) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, []);

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateStudyPlan(userData);
      setStudyPlan(plan);
      setStep(TOTAL_STEPS + 1); // Move to the plan display step
    } catch (err) {
      console.error(err);
      setError('Sorry, we couldn\'t generate your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  const startOver = () => {
    window.history.pushState({}, document.title, window.location.pathname);
    setStep(1);
    setStudyPlan(null);
    setError(null);
  }

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center">
            <LoadingSpinner />
            <h2 className="text-2xl font-bold text-primary-800 mt-6">Crafting Your Personal Plan...</h2>
            <p className="text-primary-600 mt-2">Our AI is analyzing your goals to build the perfect roadmap.</p>
        </div>
      );
    }
    
    if (studyPlan) {
      return <PlanDisplay plan={studyPlan} onStartOver={startOver} />;
    }

    switch (step) {
      case 0:
        return <WelcomeStep onNext={() => setStep(1)} />;
      case 1:
        return <GoalStep data={userData} updateData={updateUserData} onNext={nextStep} currentStep={step} totalSteps={TOTAL_STEPS - 1} />;
      case 2:
        return <ScoreStep data={userData} updateData={updateUserData} onNext={nextStep} onBack={prevStep} currentStep={step} totalSteps={TOTAL_STEPS - 1} />;
      case 3:
        return <SkillStep data={userData} updateData={updateUserData} onNext={nextStep} onBack={prevStep} currentStep={step} totalSteps={TOTAL_STEPS - 1} />;
      case 4:
        return <TimeStep data={userData} updateData={updateUserData} onNext={nextStep} onBack={prevStep} currentStep={step} totalSteps={TOTAL_STEPS - 1} />;
      case 5:
        return <PreferenceStep data={userData} updateData={updateUserData} onNext={handleGeneratePlan} onBack={prevStep} currentStep={step} totalSteps={TOTAL_STEPS - 1} />;
      default:
        return <WelcomeStep onNext={() => setStep(1)} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto">
        {renderStep()}
        {error && (
             <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                <p>{error}</p>
                <button onClick={startOver} className="mt-2 text-sm font-semibold text-red-700 underline">Start Over</button>
            </div>
        )}
      </main>
    </div>
  );
}

// --- RENDER ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
