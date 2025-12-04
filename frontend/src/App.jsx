import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Floating decorative shapes component
const FloatingShapes = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* Animated circles */}
    <div className="absolute top-20 left-10 w-16 h-16 border-4 border-black bg-neo-yellow rounded-full animate-bounce-slow opacity-60" />
    <div className="absolute top-40 right-20 w-12 h-12 border-4 border-black bg-neo-pink animate-spin-slow opacity-60" />
    <div className="absolute bottom-32 left-20 w-20 h-20 border-4 border-black bg-neo-green rotate-45 animate-pulse opacity-50" />
    <div className="absolute top-1/3 left-5 w-8 h-8 border-4 border-black bg-neo-purple rounded-full animate-float opacity-70" />
    <div className="absolute bottom-20 right-10 w-14 h-14 border-4 border-black bg-neo-orange animate-wiggle opacity-60" />
    
    {/* Sketch-style decorations */}
    <svg className="absolute top-32 right-32 w-24 h-24 animate-float-delayed opacity-40" viewBox="0 0 100 100">
      <path d="M10,50 Q30,20 50,50 T90,50" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M20,60 Q40,30 60,60 T100,60" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
    
    <svg className="absolute bottom-40 left-32 w-20 h-20 animate-spin-slow opacity-30" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="none" strokeDasharray="10,5"/>
    </svg>
    
    {/* Stars */}
    <div className="absolute top-1/4 right-1/4 text-4xl animate-pulse">✦</div>
    <div className="absolute bottom-1/4 left-1/3 text-3xl animate-bounce-slow">✧</div>
    <div className="absolute top-2/3 right-1/3 text-2xl animate-float">★</div>
    
    {/* Arrows */}
    <svg className="absolute top-1/2 left-8 w-16 h-16 animate-bounce-slow opacity-50" viewBox="0 0 100 100">
      <path d="M20,50 L80,50 M60,30 L80,50 L60,70" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
    {/* Zigzag lines */}
    <svg className="absolute bottom-1/3 right-8 w-24 h-12 opacity-40" viewBox="0 0 120 50">
      <path d="M0,25 L20,10 L40,40 L60,10 L80,40 L100,10 L120,25" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
    
    {/* Dotted circle */}
    <div className="absolute top-16 right-1/3 w-24 h-24 border-4 border-dashed border-black rounded-full animate-spin-slower opacity-30" />
  </div>
);

// Animated background pattern
const GridPattern = () => (
  <div className="fixed inset-0 z-0 opacity-[0.03]">
    <div className="w-full h-full" style={{
      backgroundImage: `
        linear-gradient(black 1px, transparent 1px),
        linear-gradient(90deg, black 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px'
    }} />
  </div>
);

function App() {
  const [mentors, setMentors] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [email, setEmail] = useState('')
  const [startTime, setStartTime] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMentors, setIsLoadingMentors] = useState(true)
  const [activeTab, setActiveTab] = useState('book') // 'book' or 'history'

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    if (email) {
      fetchBookings()
    }
  }, [email])

  const fetchMentors = async () => {
    setIsLoadingMentors(true)
    try {
      const response = await axios.get(`${API_URL}/mentors`)
      setMentors(response.data)
    } catch (error) {
      console.error('Error fetching mentors:', error)
      setMessage('Error: Could not load mentors. Is the backend running?')
    } finally {
      setIsLoadingMentors(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`)
      setBookings(response.data.filter(b => b.student_email === email))
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!selectedMentor || !email || !startTime) {
      setMessage('Please fill all fields')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      await axios.post(`${API_URL}/bookings`, {
        booking: {
          mentor_id: selectedMentor.id,
          student_email: email,
          start_time: startTime
        }
      })
      setMessage('Booking confirmed! Check your email (simulated).')
      setStartTime('')
      setSelectedMentor(null)
      fetchBookings()
    } catch (error) {
      console.error('Error booking:', error)
      if (error.response && error.response.data && error.response.data.start_time) {
        setMessage(`Error: ${error.response.data.start_time[0]}`)
      } else {
        setMessage('Booking failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMentorName = (mentorId) => {
    const mentor = mentors.find(m => m.id === mentorId)
    return mentor ? mentor.name : 'Unknown'
  }

  return (
    <div className="min-h-screen bg-neo-bg p-2 sm:p-4 md:p-6 font-mono text-black relative overflow-hidden">
      {/* Background decorations */}
      <GridPattern />
      <FloatingShapes />
      
      {/* Main content */}
      <div className="w-full max-w-[2000px] mx-auto relative z-10 px-1 sm:px-2">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <div className="inline-block relative">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter border-4 border-black bg-neo-yellow p-3 md:p-4 shadow-neo inline-block transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer hover:scale-105">
              ScaleUp
            </h1>
            {/* Decorative elements around title */}
            <span className="absolute -top-4 -left-6 text-2xl animate-bounce-slow">⚡</span>
            <span className="absolute -top-2 -right-8 text-3xl animate-wiggle">🚀</span>
          </div>
          <p className="mt-3 md:mt-4 text-sm sm:text-lg md:text-xl font-bold uppercase tracking-widest text-black/70">Mentorship Booking System</p>
          
          {/* Stats Bar */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-neo-green border-4 border-black px-4 py-2 shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-all cursor-default">
              <span className="font-black">{mentors.length}</span> Mentors
            </div>
            <div className="bg-neo-purple border-4 border-black px-4 py-2 shadow-neo-sm text-white hover:shadow-neo hover:-translate-y-1 transition-all cursor-default">
              <span className="font-black">{bookings.length}</span> Your Bookings
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Mentors List */}
          <div className="bg-white border-4 border-black shadow-neo p-4 sm:p-6 md:p-8 order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase mb-4 md:mb-8 border-b-4 border-black pb-2 flex items-center gap-2">
                <span className="text-neo-purple">→</span> Select Mentor
              </h2>
            
            {isLoadingMentors ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-black border-t-neo-yellow"></div>
                <p className="mt-4 font-bold uppercase">Loading Mentors...</p>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-12 border-4 border-dashed border-black">
                <p className="font-bold text-xl">No mentors available</p>
                <p className="mt-2 opacity-60">Check if backend is running</p>
                <button 
                  onClick={fetchMentors}
                  className="mt-4 bg-neo-yellow border-4 border-black px-4 py-2 font-bold hover:shadow-neo-sm transition-all"
                >
                  🔄 Retry
                </button>
              </div>
            ) : (
              <ul className="space-y-3 md:space-y-4">
                {mentors.map((mentor, index) => {
                  const colors = ['bg-neo-yellow', 'bg-neo-green', 'bg-neo-orange', 'bg-neo-purple'];
                  const bgColor = colors[index % colors.length];
                  return (
                    <li 
                      key={mentor.id} 
                      onClick={() => setSelectedMentor(mentor)}
                      className={`
                        p-3 md:p-4 border-4 border-black cursor-pointer transition-all duration-200 font-bold text-base md:text-lg
                        ${selectedMentor?.id === mentor.id 
                          ? 'bg-neo-blue text-white shadow-neo -translate-x-1 -translate-y-1' 
                          : `${bgColor} hover:shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5`}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{mentor.name}</span>
                        {selectedMentor?.id === mentor.id && <span className="text-xl md:text-2xl">★</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right Panel with Tabs */}
          <div className="order-1 lg:order-2">
            {/* Tab Buttons */}
            <div className="flex mb-4 gap-2">
              <button
                onClick={() => setActiveTab('book')}
                className={`flex-1 py-2 md:py-3 border-4 border-black font-black uppercase text-sm md:text-base transition-all ${
                  activeTab === 'book' 
                    ? 'bg-neo-pink shadow-neo -translate-y-1' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                📅 Book Session
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 md:py-3 border-4 border-black font-black uppercase text-sm md:text-base transition-all ${
                  activeTab === 'history' 
                    ? 'bg-neo-orange shadow-neo -translate-y-1' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                📋 My Bookings
              </button>
            </div>

            {/* Book Session Tab */}
            {activeTab === 'book' && (
              <div className="bg-neo-pink border-4 border-black shadow-neo p-4 sm:p-6 md:p-8 relative">
                <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 md:-right-6 bg-neo-yellow border-4 border-black p-1.5 md:p-2 font-black shadow-neo-sm rotate-12 text-xs sm:text-sm md:text-base">
                  BOOK NOW
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase mb-4 md:mb-8 border-b-4 border-black pb-2">Book Session</h2>
                
                {selectedMentor ? (
                  <form onSubmit={handleBook} className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block font-black text-sm md:text-lg mb-2 uppercase">Mentor</label>
                      <div className="w-full p-2 md:p-3 border-4 border-black bg-neo-green font-bold text-base md:text-xl shadow-neo-sm flex justify-between items-center">
                        <span>{selectedMentor.name}</span>
                        <button 
                          type="button"
                          onClick={() => setSelectedMentor(null)}
                          className="text-black/50 hover:text-black"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-black text-sm md:text-lg mb-2 uppercase">Your Email</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full p-2 md:p-3 border-4 border-black bg-white focus:outline-none focus:shadow-neo-sm focus:bg-neo-yellow transition-all font-bold text-sm md:text-base"
                        placeholder="you@example.com"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block font-black text-sm md:text-lg mb-2 uppercase">Start Time</label>
                      <input 
                        type="datetime-local" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        className="w-full p-2 md:p-3 border-4 border-black bg-white focus:outline-none focus:shadow-neo-sm focus:bg-neo-yellow transition-all font-bold text-sm md:text-base"
                        required 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full font-black text-base md:text-xl py-3 md:py-4 border-4 border-black transition-all uppercase tracking-wider flex items-center justify-center gap-2 ${
                        isLoading 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-neo-blue hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                          Processing...
                        </>
                      ) : (
                        <>🚀 Confirm Booking</>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="h-48 md:h-64 flex items-center justify-center border-4 border-black border-dashed bg-white/50">
                    <p className="font-bold text-base md:text-xl text-center uppercase opacity-60 px-4">
                      <span className="hidden lg:inline">← </span>
                      <span className="lg:hidden">↓ </span>
                      Choose a mentor<br/>to get started
                    </p>
                  </div>
                )}
                
                {message && (
                  <div className={`mt-4 md:mt-6 p-3 md:p-4 border-4 border-black font-bold shadow-neo-sm text-sm md:text-base ${message.includes('Error') ? 'bg-red-500 text-white' : 'bg-neo-green text-black'}`}>
                    {message.includes('Error') ? '❌ ' : '✅ '}{message}
                  </div>
                )}
              </div>
            )}

            {/* Booking History Tab */}
            {activeTab === 'history' && (
              <div className="bg-neo-orange border-4 border-black shadow-neo p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase mb-4 md:mb-8 border-b-4 border-black pb-2">My Bookings</h2>
                
                {!email ? (
                  <div className="text-center py-8 border-4 border-dashed border-black bg-white/50">
                    <p className="font-bold">Enter your email in the booking form</p>
                    <p className="mt-2 opacity-60">to see your booking history</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 border-4 border-dashed border-black bg-white/50">
                    <p className="font-bold text-xl">No bookings yet</p>
                    <p className="mt-2 opacity-60">Book a session to get started!</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {bookings.map((booking) => (
                      <li 
                        key={booking.id}
                        className="bg-white border-4 border-black p-3 md:p-4 shadow-neo-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-black text-base md:text-lg">{getMentorName(booking.mentor_id)}</p>
                            <p className="text-sm opacity-70 mt-1">📅 {formatDateTime(booking.start_time)}</p>
                          </div>
                          <span className="bg-neo-green border-2 border-black px-2 py-1 text-xs font-bold">
                            Confirmed
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
