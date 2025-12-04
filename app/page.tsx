'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Zap, Award, RotateCcw, Home, ChevronRight } from 'lucide-react'

// Types
interface Category {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  questionCount: number
}

interface Question {
  id: number
  text: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  correct_answer: string
  explanation: string
}

interface QuizSession {
  quiz_id: string
  category: string
  total_questions: number
  current_question: number
  questions: Question[]
  answers: { [key: number]: string }
  scores: { correct: number; total_answered: number; percentage: number }
}

interface ResultData {
  final_score: {
    correct: number
    total: number
    percentage: number
  }
  performance_tier: string
  performance_message: string
  question_breakdown: Array<{
    question_id: number
    question_text: string
    user_answer: string
    correct_answer: string
    is_correct: boolean
  }>
  stats: {
    best_streak: number
    categories_strong: string[]
    areas_to_improve: string[]
  }
  suggestions: string[]
  encouragement: string
}

// Categories with icons
const categories: Category[] = [
  {
    id: 'science',
    name: 'Science',
    icon: <Zap className="w-8 h-8" />,
    description: 'Test your scientific knowledge',
    questionCount: 10,
  },
  {
    id: 'history',
    name: 'History',
    icon: <BookOpen className="w-8 h-8" />,
    description: 'Explore historical events',
    questionCount: 10,
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: <Award className="w-8 h-8" />,
    description: 'Challenge your sports knowledge',
    questionCount: 10,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: <Award className="w-8 h-8" />,
    description: 'Quiz about movies and TV',
    questionCount: 10,
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: <BookOpen className="w-8 h-8" />,
    description: 'Discover world geography',
    questionCount: 10,
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: <Zap className="w-8 h-8" />,
    description: 'Tech knowledge quiz',
    questionCount: 10,
  },
]

// Home Screen
function HomeScreen({
  selectedCategory,
  onSelectCategory,
  onStartQuiz,
}: {
  selectedCategory: string | null
  onSelectCategory: (categoryId: string) => void
  onStartQuiz: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">QuizMaster</h1>
          <p className="text-white text-lg opacity-90">Test Your Knowledge</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'ring-4 ring-white bg-white shadow-lg'
                  : 'bg-white bg-opacity-95 hover:bg-opacity-100'
              }`}
              onClick={() => onSelectCategory(category.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-blue-600">{category.icon}</div>
                  {selectedCategory === category.id && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl mt-2 text-gray-900">{category.name}</CardTitle>
                <CardDescription className="text-gray-700">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{category.questionCount} questions</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Quiz Button */}
        <div className="flex justify-center">
          <Button
            onClick={onStartQuiz}
            disabled={!selectedCategory}
            className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Quiz
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Quiz Screen
function QuizScreen({
  session,
  onAnswerSubmit,
  onNextQuestion,
  isSubmitted,
  isAnswerCorrect,
  feedbackMessage,
}: {
  session: QuizSession
  onAnswerSubmit: (answer: string) => void
  onNextQuestion: () => void
  isSubmitted: boolean
  isAnswerCorrect: boolean | null
  feedbackMessage: string
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const currentQuestion = session.questions[session.current_question - 1]
  const progressPercentage = ((session.current_question - 1) / session.total_questions) * 100

  if (!currentQuestion) return null

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswerSubmit(selectedAnswer)
    }
  }

  const categoryData = categories.find((c) => c.id.toLowerCase() === session.category.toLowerCase())

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-semibold">
              Question {session.current_question} of {session.total_questions}
            </span>
            <span className="text-white font-semibold">Score: {session.scores.correct}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Category Badge */}
        <div className="mb-6 flex items-center gap-2">
          {categoryData && <div className="text-white">{categoryData.icon}</div>}
          <span className="bg-white bg-opacity-30 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {session.category}
          </span>
        </div>

        {/* Question Card */}
        <Card className="bg-white shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((optionKey) => {
                const optionValue = currentQuestion.options[optionKey as keyof typeof currentQuestion.options]
                const isSelected = selectedAnswer === optionKey
                const isCorrect = optionKey === currentQuestion.correct_answer
                const showCorrect = isSubmitted && isCorrect
                const showIncorrect = isSubmitted && isSelected && !isCorrect

                return (
                  <button
                    key={optionKey}
                    onClick={() => !isSubmitted && setSelectedAnswer(optionKey)}
                    disabled={isSubmitted}
                    className={`w-full p-4 text-left rounded-lg font-semibold transition-all ${
                      showCorrect
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : showIncorrect
                          ? 'bg-red-100 border-2 border-red-500 text-red-900'
                          : isSelected && !isSubmitted
                            ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                            : 'bg-gray-100 border-2 border-gray-300 text-gray-900 hover:bg-gray-200'
                    } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-bold mr-3">{optionKey}.</span>
                    {optionValue}
                  </button>
                )
              })}
            </div>

            {/* Feedback Section */}
            {isSubmitted && (
              <div className={`mt-6 p-4 rounded-lg ${isAnswerCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
                <p className={`font-semibold ${isAnswerCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {feedbackMessage}
                </p>
                <p className="mt-3 text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="px-8 py-3 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Submit Answer
            </Button>
          ) : session.current_question < session.total_questions ? (
            <Button
              onClick={onNextQuestion}
              className="px-8 py-3 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
            >
              Next Question
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={onNextQuestion}
              className="px-8 py-3 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
            >
              View Results
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Results Screen
function ResultsScreen({
  category,
  results,
  onTryAgain,
  onNewCategory,
}: {
  category: string
  results: ResultData
  onTryAgain: () => void
  onNewCategory: () => void
}) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const getPerformanceColor = (percentage: number) => {
    if (percentage === 100) return 'from-yellow-400 to-yellow-600'
    if (percentage >= 80) return 'from-blue-400 to-blue-600'
    if (percentage >= 60) return 'from-green-400 to-green-600'
    if (percentage >= 40) return 'from-orange-400 to-orange-600'
    return 'from-red-400 to-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Score Card */}
        <Card className="bg-white shadow-2xl mb-8 overflow-hidden">
          <div className={`bg-gradient-to-r ${getPerformanceColor(results.final_score.percentage)} h-2`} />
          <CardHeader className="text-center">
            <div className="mb-4">
              <div className="text-6xl font-bold text-gray-900">
                {results.final_score.correct}/{results.final_score.total}
              </div>
              <div className="text-2xl font-semibold text-gray-700 mt-2">
                {results.final_score.percentage}%
              </div>
            </div>
            <CardTitle className="text-3xl text-gray-900 mt-4">{results.performance_tier}</CardTitle>
            <CardDescription className="text-lg text-gray-700 mt-2">{results.performance_message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold text-blue-600">{results.stats.best_streak}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-2xl font-bold text-green-600">{results.final_score.correct}</p>
              </div>
            </div>

            {results.stats.categories_strong && results.stats.categories_strong.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-gray-700">Strong Areas</p>
                <p className="text-sm text-gray-600 mt-1">{results.stats.categories_strong.join(', ')}</p>
              </div>
            )}

            {results.stats.areas_to_improve && results.stats.areas_to_improve.length > 0 && (
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-semibold text-gray-700">Areas to Improve</p>
                <p className="text-sm text-gray-600 mt-1">{results.stats.areas_to_improve.join(', ')}</p>
              </div>
            )}

            {results.encouragement && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 italic">{results.encouragement}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Breakdown */}
        <Card className="bg-white shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900">Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.question_breakdown.map((item, index) => (
                <div key={item.question_id}>
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === item.question_id ? null : item.question_id)}
                    className={`w-full p-4 text-left rounded-lg transition-all flex items-center justify-between ${
                      item.is_correct ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                          item.is_correct ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {item.is_correct ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Question {index + 1}</p>
                        {!expandedQuestion && <p className="text-sm text-gray-600 line-clamp-1">{item.question_text}</p>}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-600 transition-transform ${expandedQuestion === item.question_id ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {expandedQuestion === item.question_id && (
                    <div className={`p-4 bg-gray-50 border-l-4 ${item.is_correct ? 'border-green-500' : 'border-red-500'}`}>
                      <p className="font-semibold text-gray-900 mb-3">{item.question_text}</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold text-gray-700">Your Answer:</span>
                          <span className="text-sm text-gray-600">{item.user_answer}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold text-gray-700">Correct Answer:</span>
                          <span className="text-sm text-gray-600">{item.correct_answer}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={onTryAgain} className="px-8 py-3 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100">
            <RotateCcw className="mr-2 w-5 h-5" />
            Try Again
          </Button>
          <Button onClick={onNewCategory} className="px-8 py-3 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100">
            <Home className="mr-2 w-5 h-5" />
            New Category
          </Button>
        </div>
      </div>
    </div>
  )
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
        <p className="text-white text-lg font-semibold">Loading Quiz...</p>
      </div>
    </div>
  )
}

// Main App Component
export default function QuizMasterApp() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'results'>('home')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [session, setSession] = useState<QuizSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [results, setResults] = useState<ResultData | null>(null)

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleStartQuiz = async () => {
    if (!selectedCategory) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Start a quiz for the ${selectedCategory} category`,
          action: 'start_quiz',
          category: selectedCategory,
          agent_id: '6931af571f3e985c1e355912',
        }),
      })

      const data = await response.json()

      if (data.success && data.response?.result) {
        const quizData = data.response.result
        setSession({
          quiz_id: quizData.quiz_id,
          category: quizData.category,
          total_questions: quizData.total_questions,
          current_question: quizData.current_question,
          questions: Array(10).fill(null).map((_, i) => ({
            id: i + 1,
            text: 'Loading question...',
            options: { A: '', B: '', C: '', D: '' },
            correct_answer: '',
            explanation: '',
          })),
          answers: {},
          scores: { correct: 0, total_answered: 0, percentage: 0 },
        })

        if (quizData.question) {
          const updatedQuestions = Array(10).fill(null).map((_, i) => ({
            id: i + 1,
            text: i === 0 ? quizData.question.text : 'Loading question...',
            options: i === 0 ? quizData.question.options : { A: '', B: '', C: '', D: '' },
            correct_answer: i === 0 ? quizData.question.correct_answer : '',
            explanation: i === 0 ? quizData.question.explanation : '',
          }))
          setSession((prev) => (prev ? { ...prev, questions: updatedQuestions } : null))
        }

        setScreen('quiz')
        setIsSubmitted(false)
      }
    } catch (error) {
      console.error('Failed to start quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSubmit = async (answer: string) => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `I selected answer ${answer} for question ${session.current_question}`,
          action: 'submit_answer',
          question_id: session.current_question,
          selected_answer: answer,
          agent_id: '6931af571f3e985c1e355912',
        }),
      })

      const data = await response.json()

      if (data.success && data.response?.result) {
        const result = data.response.result
        const newAnswers = { ...session.answers, [session.current_question]: answer }
        const isCorrect = result.is_correct

        setSession({
          ...session,
          answers: newAnswers,
          scores: result.current_score,
        })

        setIsAnswerCorrect(isCorrect)
        setFeedbackMessage(result.feedback_message || (isCorrect ? 'Correct!' : 'Incorrect'))
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextQuestion = async () => {
    if (!session) return

    if (session.current_question < session.total_questions) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Move to next question after question ${session.current_question}`,
            action: 'next_question',
            current_question: session.current_question,
            agent_id: '6931af571f3e985c1e355912',
          }),
        })

        const data = await response.json()

        if (data.success && data.response?.result) {
          const quizData = data.response.result
          const updatedQuestions = [...session.questions]
          updatedQuestions[quizData.current_question - 1] = quizData.question

          setSession({
            ...session,
            current_question: quizData.current_question,
            questions: updatedQuestions,
          })

          setIsSubmitted(false)
          setIsAnswerCorrect(null)
          setFeedbackMessage('')
        }
      } catch (error) {
        console.error('Failed to get next question:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Get results
      setIsLoading(true)
      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Get final results for quiz`,
            action: 'get_results',
            session_data: {
              quiz_id: session.quiz_id,
              category: session.category,
              answers: session.answers,
              scores: session.scores,
            },
            agent_id: '6931af571f3e985c1e355912',
          }),
        })

        const data = await response.json()

        if (data.success && data.response?.result) {
          setResults(data.response.result as ResultData)
          setScreen('results')
        }
      } catch (error) {
        console.error('Failed to get results:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleTryAgain = () => {
    setScreen('quiz')
    setIsSubmitted(false)
    setIsAnswerCorrect(null)
    setFeedbackMessage('')
    setSession((prev) =>
      prev
        ? {
            ...prev,
            current_question: 1,
            answers: {},
            scores: { correct: 0, total_answered: 0, percentage: 0 },
          }
        : null
    )
  }

  const handleNewCategory = () => {
    setScreen('home')
    setSelectedCategory(null)
    setSession(null)
    setResults(null)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (screen === 'home') {
    return <HomeScreen selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} onStartQuiz={handleStartQuiz} />
  }

  if (screen === 'quiz' && session) {
    return (
      <QuizScreen
        session={session}
        onAnswerSubmit={handleAnswerSubmit}
        onNextQuestion={handleNextQuestion}
        isSubmitted={isSubmitted}
        isAnswerCorrect={isAnswerCorrect}
        feedbackMessage={feedbackMessage}
      />
    )
  }

  if (screen === 'results' && results) {
    return (
      <ResultsScreen
        category={session?.category || ''}
        results={results}
        onTryAgain={handleTryAgain}
        onNewCategory={handleNewCategory}
      />
    )
  }

  return null
}
