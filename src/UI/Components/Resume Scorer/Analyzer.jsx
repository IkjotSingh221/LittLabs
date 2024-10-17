import React, { useState, useEffect }
    from "react";
import PerfCard from './Card';
import "./Analyzer.css";
import GradientSlider from "./Slider";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import Arcdesign from "./guage"
// import SegmentedProgressBar from './SegmentedProgressBar';

const Analyzer = ({ username, overallScore, impactScore, brevityScore, styleScore, skillsScore, recommendations, roleAlignmentScore }) => {
    const settings = {
        width: 90,
        height: 90,
        value: overallScore,
    };

    const [overall, setOverall] = useState(overallScore);
    const [impact, setImpact] = useState(impactScore);
    const [brevity, setBrevity] = useState(brevityScore);
    const [style, setStyle] = useState(styleScore);
    const [skill, setSkill] = useState(skillsScore);
    const [relevancy, setRelevancy] = useState(roleAlignmentScore);
    const [recommend, setRecommendations] = useState(recommendations);

    const [cards, setCards] = useState([
        {
            "name": "Relevancy",
            "score": relevancy
        },
        {
            "name": "Impact",
            "score": impact
        },
        {
            "name": "Brevity",
            "score": brevity
        },
        {
            "name": "Style",
            "score": style
        },
        {
            "name": "Skills",
            "score": skill
        }
    ]);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const getGreeting = () => {
            const hours = new Date().getHours();
            if (hours < 12) {
                return `Good Morning, ${username}`;
            } else if (hours < 18) {
                return `Good Afternoon, ${username}`;
            } else {
                return `Good Evening, ${username}`;
            }
        };

        setGreeting(getGreeting());
    }, []);






    return (
        <div className="fullScreen">
            <div className="topbar" style={{ padding: '10px', borderRadius: '10px 10px 0 0' }}>
                <p>Resume scorer</p>
            </div>
            <div id="cards" style={{ borderRadius: '0 0 10px 10px' }}>


                {cards.length > 0 ? (
                    cards.map((card, index) => (
                        <PerfCard className="setCard"
                            key={index} // Ideally use a unique identifier from the card data if available
                            name={card.name}
                            score={card.score}
                        />
                    ))
                ) : (
                    <p>No scores available.</p>
                )}


            </div>

            <div className="greetings">
                <h2>{greeting}</h2>
                <p>
                    Welcome to your resume review.
                </p>
            </div>

            <div className="result" style={{ padding: '10px' }}>
                <p>Your resume scored {overall} out of 100</p>
                <GradientSlider overallScore={overall} />


            </div>

            <div className="recommend">
                <h4>Recommendations</h4>
                <p style={{width:'90%'}}><ReactMarkdown
                    children={recommend}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={docco}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                        img({ node, ...props }) {
                            return (
                                <img
                                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                                    {...props}
                                />
                            );
                        },
                    }}
                /></p>

            </div>
        </div>
    );
}
export default Analyzer;