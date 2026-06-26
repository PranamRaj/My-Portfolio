import brainImg from './images/brain.png';
import './Skills.css';
function Skills(){
    const resumeSkills = [
        {
            category: "Databases",
            items: ["MySQL", "MongoDB", "PostgreSQL", "Redis"]
        },
        {
            category: "Languages",
            items: ["C/C++", "Python", "JavaScript", "TypeScript", "Java"]
        },
        {
            category: "Frontend",
            items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"]
        },
        {
            category: "Backend & Tools",
            items: ["Node.js", "Express.js", "Git", "Docker", "REST APIs"]
        }
    ];
    return(
        <section className="skills-section">
            <div className="skills-header">
                <img src={brainImg} alt="Brain Icon" className="brain-icon" />
                <h1 className="skills-title">My Technical Skills</h1>
            </div>
        <div className="skills-wrapper">
            <h2 className="skills-main-title">Technical Expertise</h2>
            <div className="skills-container">
                {resumeSkills.map((stack, index) => (
                    <div key={index} className="skill-category-card">
                        {/* Left side category label */}
                        <h3 className="category-label">{stack.category}:</h3>

                        {/* Right side bubble cloud stack */}
                        <div className="bubble-cloud">
                            {stack.items.map((skill, idx) => (
                                <span key={idx} className="skill-bubble">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </section>
    )
}
export default Skills;