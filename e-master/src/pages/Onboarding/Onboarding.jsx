import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Onboarding/Onboarding.css'

// --- Enums and Types ---
const TestType = {
  IELTS: 'IELTS',
  TOEIC: 'TOEIC',
};

const SkillLevel = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
};

// --- Constants ---
const TOTAL_STEPS = 5;

const AppLogo = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
    >
        <path d="M22 38V26" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 16V10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 26H16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 26H38" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 26C22 29.3137 19.3137 32 16 32C12.6863 32 10 29.3137 10 26C10 22.6863 12.6863 20 16 20C19.3137 20 22 22.6863 22 26Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26 26C26 22.6863 28.6863 20 32 20C35.3137 20 38 22.6863 38 26C38 29.3137 35.3137 32 32 32C28.6863 32 26 29.3137 26 26Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Gemini Service ---
// NOTE: The original implementation used a server-side AI client which is not safe
// to initialize from browser code. Replace with a safe stub that returns a
// placeholder plan. Later this can be wired to a backend API to call the real
// AI service securely.
const generateStudyPlan = async (formData) => {
    // Small delay to simulate network / generation time
    await new Promise((res) => setTimeout(res, 600));

    return `Personalized 4-week plan for ${formData.testType} (placeholder):\n\nWeek 1:\n- Day 1: Diagnostic test and review (1 hr)\n- Day 2: Listening practice (1 hr)\n...\n\n(Real plan generation is disabled in the client. Connect this to a backend service to enable AI-generated plans.)`;
};

// --- Reusable Components ---
const StepIndicator = ({ currentStep }) => {
    const progressPercentage = ((currentStep) / TOTAL_STEPS) * 100;

    return (
        <div className="step-indicator">
            <p className="step-indicator-text">Step {currentStep} of {TOTAL_STEPS}</p>
            <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};

const NavigationButtons = ({ onBack, onNext, isNextDisabled = false }) => {
    return (
        <div className="navigation-buttons">
            <button
                type="button"
                onClick={onBack}
                className="btn-back"
            >
                Back
            </button>
            <button
                type="button"
                onClick={onNext}
                disabled={isNextDisabled}
                className="btn-next"
            >
                Next
            </button>
        </div>
    );
};

// --- Step Components ---
const WelcomeStep = ({ onNext }) => {
    return (
        <div className="step-card text-center fade-in">
            <AppLogo className="app-logo-large" />
            <h1 className="title">Welcome to Your AI English Test Planner</h1>
            <p className="subtitle">
                Ready to ace the <span className="highlight-text">IELTS</span> or <span className="highlight-text">TOEIC</span>? Let's build a personalized study plan that fits your goals, schedule, and learning style.
            </p>
            <button
                onClick={onNext}
                className="btn-primary"
            >
                Let's Get Started
            </button>
        </div>
    );
};

const TestSelectionStep = ({ formData, onUpdate, onNext, onBack }) => {
    const TestOption = ({ name, isSelected, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`test-option ${isSelected ? 'selected' : ''}`}
        >
            <h3 className="test-option-title">{name}</h3>
            <p className="test-option-description">
                {name === TestType.IELTS ? 'International English Language Testing System' : 'Test of English for International Communication'}
            </p>
        </button>
    );

    return (
        <div className="step-card fade-in">
            <StepIndicator currentStep={1} />
            <h2 className="title">Choose Your Test</h2>
            <p className="subtitle">Let's start by selecting which exam you're preparing for.</p>
            
            <div className="options-container">
                <TestOption
                    name={TestType.IELTS}
                    isSelected={formData.testType === TestType.IELTS}
                    onClick={() => onUpdate({ testType: TestType.IELTS })}
                />
                <TestOption
                    name={TestType.TOEIC}
                    isSelected={formData.testType === TestType.TOEIC}
                    onClick={() => onUpdate({ testType: TestType.TOEIC })}
                />
            </div>
            
            <NavigationButtons onBack={onBack} onNext={onNext} isNextDisabled={!formData.testType} />
        </div>
    );
};

const GoalStep = ({ formData, onUpdate, onNext, onBack }) => {
    const isIELTS = formData.testType === TestType.IELTS;
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.targetScore === undefined || typeof formData.targetScore === 'string') {
            const defaultScore = isIELTS ? 6.5 : 700;
            onUpdate({ targetScore: defaultScore });
        }
    }, [isIELTS, formData.targetScore, onUpdate]);

    const scoreLabel = isIELTS ? 'Target Band Score' : 'Target Score';
    const min = isIELTS ? 0 : 10;
    const max = isIELTS ? 9 : 990;
    const step = isIELTS ? 0.5 : 10;
    
    const currentValue = typeof formData.targetScore === 'number' ? formData.targetScore : (isIELTS ? 6.5 : 700);

    return (
        <div className="step-card fade-in">
            <StepIndicator currentStep={2} />
            <h2 className="title">What's Your Goal?</h2>
            <p className="subtitle">What score are you aiming for on the {formData.testType} test?</p>

            <div className="input-box">
                 <div className="input-box-header">
                    <label htmlFor="targetScore" className="input-label">
                        {scoreLabel}
                    </label>
                    <span className="value-display">
                        {currentValue}
                    </span>
                </div>
                <input
                    type="range"
                    id="targetScore"
                    min={min}
                    max={max}
                    step={step}
                    value={currentValue}
                    onChange={(e) => onUpdate({ targetScore: parseFloat(e.target.value) })}
                    className="slider"
                />
            </div>
            
            <div className="text-center-link">
                      <button 
                          type="button" 
                          onClick={() => navigate('/input-testing')}
                          className="link-button"
                      >
                          I don't know my current score, take a test
                      </button>
            </div>

            <NavigationButtons onBack={onBack} onNext={onNext} isNextDisabled={formData.targetScore === undefined} />
        </div>
    );
};

const SkillsStep = ({ formData, onUpdate, onNext, onBack }) => {
    const handleSkillUpdate = (skill, level) => {
        onUpdate({
            skills: {
                ...formData.skills,
                [skill]: level,
            },
        });
    };

    const SkillButton = ({ level, isSelected, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`skill-button ${isSelected ? 'selected' : ''}`}
        >
            {level}
        </button>
    );

    const SkillRow = ({ skillName, currentLevel, onSelect }) => (
        <div>
            <h3 className="skill-name">{skillName}</h3>
            <div className="skill-buttons-container">
                {Object.values(SkillLevel).map(level => (
                    <SkillButton
                        key={level}
                        level={level}
                        isSelected={currentLevel === level}
                        onClick={() => onSelect(skillName, level)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="step-card fade-in">
            <StepIndicator currentStep={3} />
            <h2 className="title">Assess Your Skills</h2>
            <p className="subtitle">Be honest about your current abilities in each area.</p>

            <div className="skills-container">
                <SkillRow skillName="listening" currentLevel={formData.skills.listening} onSelect={handleSkillUpdate} />
                <SkillRow skillName="reading" currentLevel={formData.skills.reading} onSelect={handleSkillUpdate} />
                <SkillRow skillName="writing" currentLevel={formData.skills.writing} onSelect={handleSkillUpdate} />
                <SkillRow skillName="speaking" currentLevel={formData.skills.speaking} onSelect={handleSkillUpdate} />
            </div>

            <NavigationButtons onBack={onBack} onNext={onNext} />
        </div>
    );
};

const CommitmentStep = ({ formData, onUpdate, onNext, onBack }) => {
    return (
        <div className="step-card fade-in">
            <StepIndicator currentStep={4} />
            <h2 className="title">Your Study Commitment</h2>
            <p className="subtitle">How many hours per week can you dedicate to studying?</p>
            
            <div className="input-box">
                 <div className="input-box-header">
                    <label htmlFor="hoursPerWeek" className="input-label">
                        Hours per Week
                    </label>
                    <span className="value-display">
                        {formData.hoursPerWeek} hrs
                    </span>
                </div>
                <input
                    type="range"
                    id="hoursPerWeek"
                    min="1"
                    max="40"
                    step="1"
                    value={formData.hoursPerWeek}
                    onChange={(e) => onUpdate({ hoursPerWeek: parseInt(e.target.value, 10) })}
                    className="slider"
                />
                <p className="input-box-footer">
                    Consistency is key. Even a few focused hours each week can make a big difference!
                </p>
            </div>

            <NavigationButtons onBack={onBack} onNext={onNext} />
        </div>
    );
};

const PlanStep = ({ formData }) => {
    const navigate = useNavigate();
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            setIsLoading(true);
            const generatedPlan = await generateStudyPlan(formData);
            setPlan(generatedPlan);
            setIsLoading(false);
        };

        fetchPlan();
    }, [formData]);
    
    const LoadingState = () => (
        <div className="loading-state">
            <AppLogo className="app-logo-large pulsing" />
            <h2 className="title">Generating Your Personalized Plan...</h2>
            <p className="subtitle">Our AI is crafting the perfect study schedule just for you. This might take a moment.</p>
        </div>
    );

    return (
        <div className="step-card fade-in">
            <StepIndicator currentStep={5} />
            {isLoading ? (
                <LoadingState />
            ) : (
                <div>
                    <h2 className="title">Your Custom Study Plan</h2>
                    <p className="subtitle">Here is your 4-week plan to achieve your {formData.testType} goals!</p>
                    <div className="plan-display">
                        {/* Using a simple pre tag to render markdown-like text */}
                        <pre className="plan-content">{plan}</pre>
                    </div>
                    <div className="finish-container" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Finish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        skills: {
            listening: SkillLevel.Beginner,
            reading: SkillLevel.Beginner,
            writing: SkillLevel.Beginner,
            speaking: SkillLevel.Beginner,
        },
        hoursPerWeek: 5,
    });

    const handleNext = useCallback(() => {
        setStep(prev => prev + 1);
    }, []);

    const handleBack = useCallback(() => {
        setStep(prev => prev - 1);
    }, []);

    const updateFormData = useCallback((data) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);
    
    const renderStep = () => {
        switch (step) {
            case 0:
                return <WelcomeStep onNext={handleNext} />;
            case 1:
                return <TestSelectionStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />;
            case 2:
                return <GoalStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <SkillsStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />;
            case 4:
                return <CommitmentStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />;
            case 5:
                return <PlanStep formData={formData} />;
            default:
                return <WelcomeStep onNext={handleNext} />;
        }
    };

    return (
        <main className="main-container">
            <div className="content-wrapper">
                {renderStep()}
            </div>
        </main>
    );
};

// Export the App component so it can be used as a route target. Do NOT mount
// the component here — the application router will render it when the
// user navigates to /onboarding.
export default App;
