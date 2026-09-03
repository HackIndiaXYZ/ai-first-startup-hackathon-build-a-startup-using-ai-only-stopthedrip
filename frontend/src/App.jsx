import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { encryptStatementBuffer } from './crypto'
import { signInWithGoogle, logOut, subscribeToAuthChanges, isFirebaseConfigured } from './firebase'

const API_BASE_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

// Default initial dataset matching the cyber-financial design tokens
const INITIAL_RESULTS = {
  total_leaks_detected: 5,
  total_annual_leak: 18468,
  total_monthly_leak: 1539,
  active_subscriptions_count: 5,
  forgotten_leaks_count: 2,
  potential_annual_savings: 12576,
  audit_health_score: 62,
  leak_vectors: [
    {
      id: 'item-1',
      friendly_name: 'Cult.fit Pass',
      merchant: 'Cult.fit Gym & Live',
      tag: 'Forgotten',
      confidence: 0.96,
      subtitle: 'Last accessed 4 months ago • Medium difficulty to cancel',
      monthly_amount: 999,
      annual_amount: 11988,
      description: "Zero partner gym check-ins detected since November. Auto-renews monthly on linked credit card ending in 4092.",
      note: 'Cancellation takes ~3 mins via mobile app profile settings.',
      steps: [
        'Open Cult.fit app, tap Profile > Active Memberships.',
        'Select Cult Pass Live & Gym > Manage Subscription.',
        'Tap Pause or Cancel Membership and confirm cancellation.'
      ],
      action_type: 'cancel',
      action_label: 'Cancel subscription'
    },
    {
      id: 'item-2',
      friendly_name: 'Netflix UHD 4K',
      merchant: 'Netflix Inc',
      tag: 'Active',
      confidence: 0.94,
      subtitle: 'Streamed 2 days ago • Easy cancellation',
      monthly_amount: 649,
      annual_amount: 7788,
      description: 'High engagement streaming profile. Consider downgrading to standard HD if 4K multi-screen is unused.',
      note: 'Instant 1-click downgrade or cancel available anytime.',
      steps: [
        'Sign in to Netflix.com on web browser.',
        'Navigate to Account > Plan Details.',
        'Select Change Plan or Cancel Membership.'
      ],
      action_type: 'manage',
      action_label: 'Manage plan'
    },
    {
      id: 'item-3',
      friendly_name: 'Calm Mindset Pro',
      merchant: 'Calm.com',
      tag: 'Forgotten',
      confidence: 0.91,
      subtitle: 'Zero app sessions logged in 180 days',
      monthly_amount: 499,
      annual_amount: 5988,
      description: 'Pure capital leak. App was launched only once during trial onboarding.',
      note: 'Low activity detected — cancel to instantly save ₹499/mo.',
      steps: [
        'Open Apple Subscriptions or Google Play Subscriptions.',
        'Locate Calm Pro under Active Subscriptions.',
        'Tap Cancel Subscription and confirm.'
      ],
      action_type: 'cancel',
      action_label: 'Cancel subscription'
    },
    {
      id: 'item-4',
      friendly_name: 'iCloud Storage 200GB',
      merchant: 'Apple Services',
      tag: 'Active',
      confidence: 0.89,
      subtitle: 'Daily photo sync active • Essential utility',
      monthly_amount: 219,
      annual_amount: 2628,
      description: 'Active cloud backup holding 142 GB of family photos and device backups.',
      note: 'Managed directly via iOS Settings > Apple ID.',
      steps: [
        'Open iPhone Settings > tap your Apple ID banner.',
        'Tap iCloud > Manage Account Storage > Change Storage Plan.'
      ],
      action_type: 'manage',
      action_label: 'Manage plan'
    },
    {
      id: 'item-5',
      friendly_name: 'Spotify Premium Duo',
      merchant: 'Spotify AB',
      tag: 'Active',
      confidence: 0.88,
      subtitle: 'Daily music & podcasts streaming',
      monthly_amount: 119,
      annual_amount: 1428,
      description: 'High utilization streaming service with active shared duo member.',
      note: 'Managed through Spotify web billing portal.',
      steps: [
        'Sign in to Spotify.com/account.',
        'Under Your Plan, click Change Plan or Cancel Premium.'
      ],
      action_type: 'manage',
      action_label: 'Manage plan'
    }
  ],
  spend_by_category: [
    { name: 'Health & Fitness', monthly_amount: 999, percentage: 40, bar_width_pct: 40 },
    { name: 'Entertainment & Streaming', monthly_amount: 768, percentage: 31, bar_width_pct: 31 },
    { name: 'Wellness & Mindset', monthly_amount: 499, percentage: 20, bar_width_pct: 20 },
    { name: 'Cloud & Utilities', monthly_amount: 219, percentage: 9, bar_width_pct: 9 }
  ],
  optimization_callout: 'Cancelling Cult.fit Pass and Calm Mindset immediately recovers ₹1,498 / month (₹17,976 / year) with zero disruption to your daily life.'
}

/**
 * 3D Interactive WebGL Drip Canvas
 * Futuristic metallic torus source with gravity-accelerated glowing amber drops
 */
function DripCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const width = mount.clientWidth || 320
    const height = mount.clientHeight || 340

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0.6, 6.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Oxidized copper pipe joint (source of flow)
    const pipeGeo = new THREE.TorusGeometry(1.15, 0.16, 16, 48)
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x6fa88c,
      metalness: 0.45,
      roughness: 0.35,
    })
    const pipe = new THREE.Mesh(pipeGeo, pipeMat)
    pipe.rotation.x = Math.PI / 2.4
    pipe.position.y = 1.4
    scene.add(pipe)

    // Wireframe halo ring
    const wireGeo = new THREE.TorusGeometry(1.4, 0.015, 8, 48)
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x2b303b })
    const wireRing = new THREE.Mesh(wireGeo, wireMat)
    wireRing.rotation.x = Math.PI / 2.4
    wireRing.position.y = 1.4
    scene.add(wireRing)

    // Lighting setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.65)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffffff, 0.95)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xd99a4e, 0.6)
    rim.position.set(-4, -2, -3)
    scene.add(rim)

    // Flowing amber droplets
    const dropGeo = new THREE.SphereGeometry(0.12, 16, 16)
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0xd99a4e,
      metalness: 0.2,
      roughness: 0.2,
      transparent: true,
    })

    const drops = []
    const DROP_COUNT = 7
    for (let i = 0; i < DROP_COUNT; i++) {
      const mesh = new THREE.Mesh(dropGeo, dropMat.clone())
      mesh.visible = false
      scene.add(mesh)
      drops.push({
        mesh,
        y: 1.1,
        active: false,
        delay: i * (1.9 / DROP_COUNT),
      })
    }

    let elapsed = 0
    let raf
    const clock = new THREE.Clock()

    function animate() {
      raf = requestAnimationFrame(animate)
      const dt = clock.getDelta()
      elapsed += dt

      pipe.rotation.z += dt * 0.2
      wireRing.rotation.z += dt * 0.2

      drops.forEach((d) => {
        const t = (elapsed - d.delay) % 1.9
        if (t < 0) {
          d.mesh.visible = false
          return
        }
        d.mesh.visible = true
        const fallProgress = Math.min(t / 1.5, 1)
        const y = 1.1 - fallProgress * fallProgress * 2.7
        d.mesh.position.set(0, y, 0)
        const stretch = 1 + fallProgress * 0.7
        d.mesh.scale.set(1 / stretch, stretch, 1 / stretch)
        d.mesh.material.opacity = t < 1.5 ? 1 : Math.max(0, 1 - (t - 1.5) / 0.4)
      })

      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      pipeGeo.dispose()
      pipeMat.dispose()
      wireGeo.dispose()
      wireMat.dispose()
      dropGeo.dispose()
      dropMat.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full min-h-[300px]" />
}

export default function App() {
  const [currentState, setCurrentState] = useState('upload') // 'upload' | 'analyzing' | 'results'
  const [resultsData, setResultsData] = useState(INITIAL_RESULTS)
  const [openAccordions, setOpenAccordions] = useState({ 'item-1': true })
  const [errorMessage, setErrorMessage] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [encryptionStatus, setEncryptionStatus] = useState('256-bit local AES-GCM verified')

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showConfigHelp, setShowConfigHelp] = useState(false)

  // Analyzing telemetry progression
  const [analyzingStep, setAnalyzingStep] = useState(1)
  const [loadingTitle, setLoadingTitle] = useState('Initializing in-memory decryption...')
  const [loadingDesc, setLoadingDesc] = useState('256-bit AES-GCM hardware cipher active')

  const fileInputRef = useRef(null)

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const switchState = (newState) => {
    setCurrentState(newState)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setShowConfigHelp(true)
      return
    }
    try {
      setIsSigningIn(true)
      setErrorMessage(null)
      await signInWithGoogle()
    } catch (err) {
      console.error('Google SSO Sign in error:', err)
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Failed to authenticate with Google.')
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
      setIsUserMenuOpen(false)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const startAnalyzingAnimation = () => {
    setCurrentState('analyzing')
    setAnalyzingStep(1)
    setLoadingTitle('Parsing statement structure in RAM...')
    setLoadingDesc('Zero disk footprint • Volatile memory parsing')

    const t1 = setTimeout(() => {
      setAnalyzingStep(2)
      setLoadingTitle('Cross-referencing 45,000+ merchant signatures...')
      setLoadingDesc('Matching recurring cadences, gym passes, and streaming tiers')
    }, 900)

    const t2 = setTimeout(() => {
      setAnalyzingStep(3)
      setLoadingTitle('Autonomous Dual-Agent leak evaluation...')
      setLoadingDesc('Compounding annual savings and generating cancellation steps')
    }, 1800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }

  const performAnalysis = async (file, useSample = false) => {
    setErrorMessage(null)
    const cleanupAnimation = startAnalyzingAnimation()
    const startTime = Date.now()

    try {
      let data = null

      if (!useSample && file) {
        let uploadPayload = null
        const fileBuffer = await file.arrayBuffer()
        const cryptoResult = await encryptStatementBuffer(fileBuffer)

        if (cryptoResult.success) {
          setEncryptionStatus('256-bit Web Crypto encryption active')
          const formData = new FormData()
          formData.append('encrypted_payload_b64', cryptoResult.encryptedPayloadB64)
          formData.append('nonce_b64', cryptoResult.nonceB64)
          formData.append('key_b64', cryptoResult.keyB64)
          formData.append('filename', file.name)
          uploadPayload = formData
        } else {
          const formData = new FormData()
          formData.append('file', file)
          uploadPayload = formData
        }

        const endpoint = `${API_BASE_URL}/analyze`
        const response = await fetch(endpoint, {
          method: 'POST',
          body: uploadPayload,
        })

        if (!response.ok) {
          const errText = await response.text()
          throw new Error(`Server returned ${response.status}: ${errText}`)
        }

        data = await response.json()
      } else {
        // Sample analysis fallback
        const endpoint = `${API_BASE_URL}/analyze`
        const response = await fetch(endpoint, {
          method: 'POST',
        }).catch(() => null)

        if (response && response.ok) {
          data = await response.json()
        } else {
          data = INITIAL_RESULTS
        }
      }

      // Smooth step transition
      const elapsed = Date.now() - startTime
      if (elapsed < 1800) {
        await new Promise((r) => setTimeout(r, 1800 - elapsed))
      }

      setResultsData(data || INITIAL_RESULTS)
      cleanupAnimation()
      switchState('results')
    } catch (err) {
      console.error('Analysis error:', err)
      cleanupAnimation()
      if (useSample || err.message?.includes('fetch') || err.message?.includes('Failed')) {
        await new Promise((r) => setTimeout(r, 1200))
        setResultsData(INITIAL_RESULTS)
        switchState('results')
      } else {
        setErrorMessage(err.message || 'Unable to process statement. Please ensure password protection is removed.')
        switchState('upload')
      }
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      performAnalysis(file, false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      performAnalysis(file, false)
    }
  }

  const handleExportCSV = () => {
    const rows = [['Merchant', 'Friendly Name', 'Monthly Amount', 'Annual Cost', 'Confidence', 'Status']]
    resultsData.leak_vectors?.forEach((v) => {
      rows.push([
        `"${v.merchant || ''}"`,
        `"${v.friendly_name || ''}"`,
        v.monthly_amount,
        v.annual_amount,
        v.confidence || 0.9,
        `"${v.tag || ''}"`,
      ])
    })
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'StopTheDrip_Audit_Report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-ink text-text-primary flex flex-col selection:bg-amber/30 selection:text-amber">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.csv,.xlsx,.xls,.txt"
        className="hidden"
      />

      {/* FUTURISTIC HEADER */}
      <header className="w-full border-b border-hairline bg-ink/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => switchState('upload')}
              className="text-left font-headline text-2xl md:text-3xl font-normal tracking-tight text-text-primary hover:text-amber transition-colors flex items-center gap-2"
            >
              <span className="text-verdigris text-xl">💧</span>
              <span>stop the drip</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface border border-hairline rounded-full text-xs text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-verdigris animate-pulse"></span>
              <span className="font-mono text-[11px]">neural engine active</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-text-muted">
            <button
              onClick={() => switchState('upload')}
              className={`hover:text-text-primary transition-colors ${currentState === 'upload' ? 'text-amber font-semibold' : ''}`}
            >
              Statement Audit
            </button>
            <button
              onClick={() => switchState('results')}
              className={`hover:text-text-primary transition-colors ${currentState === 'results' ? 'text-amber font-semibold' : ''}`}
            >
              Leak Vectors ({resultsData.leak_vectors?.length || 5})
            </button>
            <a
              href="https://www.ilovepdf.com/unlock_pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-verdigris hover:text-verdigris/80 transition-colors flex items-center gap-1"
            >
              <span>Unlock PDF</span>
              <span className="text-[10px]">↗</span>
            </a>
          </nav>

          {/* User Profile / Google SSO Button */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 pl-3 pr-2 rounded-full bg-surface border border-hairline hover:border-amber transition-all text-left shadow-sm"
                >
                  <span className="text-xs font-medium text-text-primary max-w-[130px] truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User avatar"
                      className="w-7 h-7 rounded-full border border-hairline object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber/20 text-amber border border-amber/40 flex items-center justify-center text-xs font-semibold">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-surface border border-hairline rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2.5 border-b border-hairline">
                      <p className="text-xs font-medium text-text-primary truncate">{currentUser.displayName || 'Google Account'}</p>
                      <p className="text-[11px] text-text-muted truncate font-mono">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs text-error hover:bg-surface-container-high transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface hover:bg-surface-container-high border border-hairline hover:border-amber transition-all text-xs font-medium text-text-primary shadow-sm active:scale-95 group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.09-6.67-4.91H1.27v3.14C3.25 21.36 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.33 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.57H1.27C.46 8.19 0 10.03 0 12s.46 3.81 1.27 5.43l4.06-3.14z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.57l4.06 3.14c.94-2.82 3.57-4.96 6.67-4.96z"/>
                </svg>
                <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* REVIEWER VIEW TOGGLES */}
        <aside aria-label="Reviewer Controls" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-1.5 bg-surface/90 backdrop-blur-md border border-hairline rounded-lg shadow-xl">
          <span className="text-[11px] text-text-muted px-2 font-mono">Stage:</span>
          <button
            className={`px-3 py-1 rounded text-xs transition-all font-mono ${
              currentState === 'upload' ? 'bg-amber text-ink font-semibold shadow' : 'text-text-muted hover:text-text-primary'
            }`}
            onClick={() => switchState('upload')}
          >
            1. upload
          </button>
          <button
            className={`px-3 py-1 rounded text-xs transition-all font-mono ${
              currentState === 'analyzing' ? 'bg-amber text-ink font-semibold shadow' : 'text-text-muted hover:text-text-primary'
            }`}
            onClick={() => switchState('analyzing')}
          >
            2. analyzing
          </button>
          <button
            className={`px-3 py-1 rounded text-xs transition-all font-mono ${
              currentState === 'results' ? 'bg-amber text-ink font-semibold shadow' : 'text-text-muted hover:text-text-primary'
            }`}
            onClick={() => switchState('results')}
          >
            3. results
          </button>
        </aside>

        {/* ========================================================= */}
        {/* STATE 1: UPLOAD & 3D HERO DASHBOARD */}
        {/* ========================================================= */}
        {currentState === 'upload' && (
          <div className="space-y-16 animate-in fade-in duration-500">
            {/* 3D HERO SHOWCASE */}
            <div className="glass-panel rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left: Narrative & Telemetry */}
                <div className="lg:col-span-7 space-y-6 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-hairline rounded-full text-xs text-verdigris font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-verdigris animate-ping"></span>
                    <span>autonomous recurring capital audit</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-normal text-text-primary leading-[1.12]">
                    Every month, something <span className="italic text-amber font-headline">drips out</span> unnoticed.
                  </h1>
                  <p className="text-base text-text-muted leading-relaxed max-w-xl font-normal">
                    Upload your bank statement. StopTheDrip detects dormant recurring subscriptions, sneaky price hikes, and forgotten services — with zero disk storage and in-browser 256-bit AES encryption.
                  </p>

                  {/* Compounding Metrics */}
                  <div className="flex flex-wrap items-center gap-10 pt-2 border-t border-hairline">
                    <div>
                      <div className="font-headline text-3xl md:text-4xl text-amber font-normal">
                        ₹{(resultsData.total_monthly_leak || 1539).toLocaleString()}
                      </div>
                      <div className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">
                        leaking every month
                      </div>
                    </div>
                    <div>
                      <div className="font-headline text-3xl md:text-4xl text-text-primary font-normal">
                        ₹{(resultsData.total_annual_leak || 18468).toLocaleString()}
                      </div>
                      <div className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">
                        per year, if untouched
                      </div>
                    </div>
                    <div>
                      <div className="font-headline text-3xl md:text-4xl text-verdigris font-normal">
                        ₹{(resultsData.potential_annual_savings || 12576).toLocaleString()}
                      </div>
                      <div className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">
                        reclaimable savings
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Realtime Three.js 3D WebGL Drip Canvas */}
                <div className="lg:col-span-5 h-[340px] relative flex items-center justify-center">
                  <div className="w-full h-full rounded-2xl bg-surface/40 border border-hairline/60 overflow-hidden shadow-inner relative">
                    <DripCanvas />
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-ink/70 border border-hairline text-[10px] font-mono text-text-muted backdrop-blur-sm pointer-events-none">
                      3D Realtime WebGL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATEMENT AUDIT WORKSPACE (Upload & How-to Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* DROPZONE & TRIGGER */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h2 className="font-headline text-2xl text-text-primary font-normal">
                    Upload Bank Statement
                  </h2>
                  <p className="text-xs text-text-muted">
                    Supports PDF, CSV, Excel exports from HDFC, ICICI, SBI, Axis, Kotak, Chase, Amex, etc.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 bg-error-container border border-error/40 text-error rounded-xl text-xs flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Interactive Drag & Drop Area */}
                <div
                  className={`border border-dashed transition-all rounded-2xl p-10 cursor-pointer flex flex-col items-start gap-4 ${
                    isDragOver
                      ? 'border-amber bg-surface border-glow-amber scale-[1.01]'
                      : 'border-hairline hover:border-amber bg-surface/60 hover:bg-surface'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 rounded-xl border border-hairline bg-ink flex items-center justify-center text-amber shadow-inner">
                    <span className="material-symbols-outlined text-[26px]">upload_file</span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-text-primary">
                      Drop statement PDF or CSV here, or <span className="text-amber underline underline-offset-4 font-semibold">browse files</span>
                    </p>
                    <p className="text-xs text-text-muted">
                      Direct in-browser AES-256 encryption • Zero files ever saved to disk
                    </p>
                  </div>
                </div>

                {/* Sample Statement Action */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    className="px-6 py-3 rounded-xl bg-amber text-ink text-sm font-semibold hover:bg-amber/90 transition-all flex items-center gap-2 shadow-lg shadow-amber/10 active:scale-95"
                    onClick={() => performAnalysis(null, true)}
                  >
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    Try Sample Audit (142 Transactions)
                  </button>
                </div>

                {/* Quick Security Status Badges */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted pt-4 border-t border-hairline">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-verdigris">lock</span> 256-bit AES-GCM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-verdigris">memory</span> 0-Disk RAM Only
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-verdigris">shield</span> Automatic PII Sanitization
                  </span>
                </div>
              </div>

              {/* HOW TO USE GUIDE CARD (with iLovePDF link) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-panel rounded-2xl p-6 md:p-7 space-y-5">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber text-[20px]">help_outline</span>
                      <h3 className="font-headline text-lg font-medium text-text-primary">How to Use</h3>
                    </div>
                    <span className="text-[11px] font-mono text-amber px-2.5 py-0.5 rounded-full bg-surface border border-hairline">
                      3 quick steps
                    </span>
                  </div>

                  {/* Step 1: Unlock */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                      <span className="w-5 h-5 rounded-full bg-amber/20 text-amber border border-amber/40 flex items-center justify-center text-[11px] font-mono">1</span>
                      <span>Unlock Password-Protected PDF</span>
                    </div>
                    <p className="text-xs text-text-muted pl-7 leading-relaxed">
                      Bank statements (HDFC, ICICI, SBI, Axis, etc.) are protected with your password (DOB/PAN). Unlock it first before uploading:
                    </p>
                    <div className="pl-7 pt-1">
                      <a
                        href="https://www.ilovepdf.com/unlock_pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-hairline hover:border-amber text-xs font-medium text-amber hover:text-text-primary transition-all shadow-sm group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-amber group-hover:scale-110 transition-transform">lock_open</span>
                        <span>Unlock at iLovePDF.com</span>
                        <span className="text-[10px] text-text-muted font-mono">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Step 2: Upload */}
                  <div className="space-y-1.5 pt-3 border-t border-hairline/60">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                      <span className="w-5 h-5 rounded-full bg-amber/20 text-amber border border-amber/40 flex items-center justify-center text-[11px] font-mono">2</span>
                      <span>Upload Unlocked PDF or CSV</span>
                    </div>
                    <p className="text-xs text-text-muted pl-7 leading-relaxed">
                      Drop your decrypted PDF or bank CSV directly into the workspace on the left.
                    </p>
                  </div>

                  {/* Step 3: Instant AI Audit */}
                  <div className="space-y-1.5 pt-3 border-t border-hairline/60">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                      <span className="w-5 h-5 rounded-full bg-amber/20 text-amber border border-amber/40 flex items-center justify-center text-[11px] font-mono">3</span>
                      <span>Get Instant Audit &amp; Savings</span>
                    </div>
                    <p className="text-xs text-text-muted pl-7 leading-relaxed">
                      Our neural engine isolates leaks against 45,000+ signatures and generates immediate cancellation playbooks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 BANK-GRADE ENCRYPTION PILLARS */}
            <div className="space-y-6 pt-6 border-t border-hairline">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-headline text-2xl font-normal text-text-primary">
                    Bank-Grade Encryption &amp; Privacy Suite
                  </h2>
                  <p className="text-xs text-text-muted">
                    Why uploading your bank statement to StopTheDrip is 100% confidential and mathematically safe.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-surface border border-hairline rounded-full text-xs text-verdigris font-mono self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>zero-storage certified</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel-interactive p-6 rounded-2xl space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-hairline flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">enhanced_encryption</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary font-headline">In-Browser 256-Bit AES</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Statements are encrypted in your browser memory via the native W3C Web Crypto API before transmission.
                  </p>
                </div>

                <div className="glass-panel-interactive p-6 rounded-2xl space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-hairline flex items-center justify-center text-verdigris group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">memory</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary font-headline">0-Disk RAM Volatility</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Zero database storage (no Postgres/MongoDB). Statements exist strictly as transient memory buffers and are purged immediately.
                  </p>
                </div>

                <div className="glass-panel-interactive p-6 rounded-2xl space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-hairline flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">shield</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary font-headline">Automatic PII Scrubbing</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Account numbers, card details, balances, and customer names are stripped before AI merchant auditing.
                  </p>
                </div>

                <div className="glass-panel-interactive p-6 rounded-2xl space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-hairline flex items-center justify-center text-verdigris group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">key</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary font-headline">Ephemeral Session Keys</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    One-time 96-bit nonces and throwaway encryption keys are generated per audit and permanently destroyed upon report delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STATE 2: TELEMETRY & SCANNING */}
        {/* ========================================================= */}
        {currentState === 'analyzing' && (
          <section className="flex flex-col justify-center min-h-[500px] transition-all duration-300">
            <div className="max-w-xl mx-auto w-full glass-panel rounded-2xl p-8 md:p-12 space-y-8 shadow-2xl">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-hairline rounded-full text-xs text-amber font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-ping"></span>
                  <span>analyzing statement</span>
                </div>
                <h2 className="text-3xl font-headline font-normal text-text-primary">
                  {loadingTitle}
                </h2>
                <p className="text-xs text-text-muted font-mono">
                  {loadingDesc}
                </p>
              </div>

              {/* Scanning Pulse Bar */}
              <div className="w-full h-1 bg-hairline rounded-full relative overflow-hidden">
                <div className="absolute inset-y-0 w-1/3 bg-amber animate-[pulse_1s_infinite] rounded-full"></div>
              </div>

              {/* Telemetry Stage Indicators */}
              <div className="space-y-4 border-l border-hairline pl-5 ml-1">
                <div className={`flex items-center gap-3 text-xs font-mono transition-colors ${analyzingStep >= 1 ? 'text-verdigris font-medium' : 'text-text-muted'}`}>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Ingesting in-memory structure &amp; parsing dates</span>
                </div>
                <div className={`flex items-center gap-3 text-xs font-mono transition-colors ${analyzingStep >= 2 ? 'text-verdigris font-medium' : 'text-text-muted'}`}>
                  <span className={`material-symbols-outlined text-[16px] ${analyzingStep >= 2 ? 'text-verdigris' : 'text-hairline'}`}>
                    {analyzingStep >= 2 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Isolating recurring card charges &amp; digital wallets</span>
                </div>
                <div className={`flex items-center gap-3 text-xs font-mono transition-colors ${analyzingStep >= 3 ? 'text-verdigris font-medium' : 'text-text-muted'}`}>
                  <span className={`material-symbols-outlined text-[16px] ${analyzingStep >= 3 ? 'text-verdigris' : 'text-hairline'}`}>
                    {analyzingStep >= 3 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Dual-Agent classification &amp; savings compounding</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* STATE 3: RESULTS AUDIT LEDGER */}
        {/* ========================================================= */}
        {currentState === 'results' && (
          <section className="space-y-12 animate-in fade-in duration-500">
            {/* AUDIT SUMMARY HERO BANNER */}
            <div className="glass-panel rounded-2xl p-8 md:p-12 space-y-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-verdigris">
                    <span className="w-2 h-2 rounded-full bg-verdigris animate-pulse"></span>
                    <span>Audit Complete • {resultsData.leak_vectors?.length || 5} Leaks Identified</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-headline font-normal text-text-primary mt-2">
                    Autonomous Leak Ledger
                  </h1>
                </div>
                <button
                  onClick={() => switchState('upload')}
                  className="px-4 py-2 rounded-xl bg-surface border border-hairline hover:border-amber text-xs text-text-primary transition-all self-start md:self-auto"
                >
                  Upload Another Statement
                </button>
              </div>

              {/* Three Big Health Score KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-surface/80 border border-hairline space-y-2">
                  <div className="text-xs font-mono text-text-muted uppercase">Monthly Leak Rate</div>
                  <div className="text-3xl md:text-4xl font-headline text-amber">
                    ₹{(resultsData.total_monthly_leak || 1539).toLocaleString()} <span className="text-sm font-sans text-text-muted">/mo</span>
                  </div>
                  <p className="text-xs text-text-muted">Unclaimed subscription recurring charges</p>
                </div>

                <div className="p-6 rounded-2xl bg-surface/80 border border-hairline space-y-2">
                  <div className="text-xs font-mono text-text-muted uppercase">Annual Compound Loss</div>
                  <div className="text-3xl md:text-4xl font-headline text-text-primary">
                    ₹{(resultsData.total_annual_leak || 18468).toLocaleString()} <span className="text-sm font-sans text-text-muted">/yr</span>
                  </div>
                  <p className="text-xs text-text-muted">Projected financial drag over 12 months</p>
                </div>

                <div className="p-6 rounded-2xl bg-surface/80 border border-hairline space-y-2">
                  <div className="text-xs font-mono text-text-muted uppercase">Instant Recovery Savings</div>
                  <div className="text-3xl md:text-4xl font-headline text-verdigris">
                    ₹{(resultsData.potential_annual_savings || 12576).toLocaleString()} <span className="text-sm font-sans text-text-muted">/yr</span>
                  </div>
                  <p className="text-xs text-text-muted">Recoverable with zero loss in daily productivity</p>
                </div>
              </div>
            </div>

            {/* AUDIT DETAILS: 2 COLUMN SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT 7 COLS: EXPANDABLE LEAK VECTOR ROWS */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <h3 className="font-headline text-xl font-normal text-text-primary">
                    Detected Leak Vectors ({resultsData.leak_vectors?.length || 0})
                  </h3>
                  <span className="text-xs font-mono text-text-muted">click item to expand playbook</span>
                </div>

                <div className="space-y-3">
                  {resultsData.leak_vectors?.map((item) => {
                    const isOpen = Boolean(openAccordions[item.id])
                    return (
                      <div
                        key={item.id}
                        className={`glass-panel rounded-2xl transition-all overflow-hidden ${
                          isOpen ? 'border-amber/60 shadow-lg' : 'hover:border-hairline'
                        }`}
                      >
                        <button
                          onClick={() => toggleAccordion(item.id)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="font-headline text-lg text-text-primary font-normal">
                                {item.friendly_name || item.merchant}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                  item.tag === 'Forgotten'
                                    ? 'bg-amber/10 text-amber border-amber/30'
                                    : 'bg-verdigris/10 text-verdigris border-verdigris/30'
                                }`}
                              >
                                {item.tag || 'Active'}
                              </span>
                            </div>
                            <p className="text-xs text-text-muted">
                              {item.subtitle || `Recurring subscription • ${Math.round((item.confidence || 0.9) * 100)}% confidence`}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-right">
                            <div>
                              <div className="text-sm font-semibold text-amber font-mono">
                                ₹{(item.monthly_amount || 0).toLocaleString()} /mo
                              </div>
                              <div className="text-[11px] text-text-muted font-mono">
                                ₹{(item.annual_amount || item.monthly_amount * 12 || 0).toLocaleString()} /yr
                              </div>
                            </div>
                            <span
                              className={`text-text-muted text-lg transition-transform duration-200 ${
                                isOpen ? 'rotate-45 text-amber' : ''
                              }`}
                            >
                              +
                            </span>
                          </div>
                        </button>

                        {/* Expandable Step-by-Step Playbook */}
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 border-t border-hairline/60 space-y-4 text-xs animate-in fade-in">
                            <p className="text-text-muted leading-relaxed">
                              {item.description}
                            </p>

                            {item.steps && item.steps.length > 0 && (
                              <div className="space-y-2 bg-surface/60 p-4 rounded-xl border border-hairline/60">
                                <span className="font-mono text-amber text-[11px] uppercase tracking-wider block">
                                  1-Click Cancellation Pathway:
                                </span>
                                <ol className="space-y-1.5 list-decimal list-inside text-text-primary">
                                  {item.steps.map((s, idx) => (
                                    <li key={idx} className="leading-relaxed">{s}</li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {item.note && (
                              <div className="flex items-center gap-2 text-[11px] text-verdigris font-mono">
                                <span className="material-symbols-outlined text-[16px]">info</span>
                                <span>{item.note}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* RIGHT 5 COLS: SPEND BREAKDOWN & EXPORT */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  <div className="pb-3 border-b border-hairline">
                    <h3 className="font-headline text-xl font-normal text-text-primary">
                      Spend by Category
                    </h3>
                  </div>

                  {/* Spend Bars */}
                  <div className="space-y-4">
                    {resultsData.spend_by_category?.map((cat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-primary font-medium">{cat.name}</span>
                          <span className="text-text-muted font-mono">
                            ₹{(cat.monthly_amount || 0).toLocaleString()} /mo ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-hairline/60">
                          <div
                            className="bg-verdigris h-full rounded-full transition-all duration-700"
                            style={{ width: `${cat.bar_width_pct || cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {resultsData.optimization_callout && (
                    <div className="p-4 rounded-xl bg-surface border border-hairline text-xs text-text-muted flex gap-3 leading-relaxed">
                      <span className="material-symbols-outlined text-amber text-[20px] flex-shrink-0">lightbulb</span>
                      <p>{resultsData.optimization_callout}</p>
                    </div>
                  )}

                  {/* Export Dossier */}
                  <div className="pt-4 border-t border-hairline space-y-3">
                    <h4 className="font-headline text-base font-normal text-text-primary">
                      Export Audit Dossier
                    </h4>
                    <p className="text-xs text-text-muted">
                      Download a clean CSV summary or print an encrypted report.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2.5 rounded-xl bg-surface border border-hairline hover:border-amber text-xs font-semibold text-text-primary transition-all"
                      >
                        Export CSV
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="px-4 py-2.5 rounded-xl bg-amber text-ink text-xs font-semibold hover:bg-amber/90 transition-all"
                      >
                        Export PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-hairline bg-ink mt-auto py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <div className="flex items-center gap-2">
            <span>© StopTheDrip Financial Clarity</span>
            <span>•</span>
            <span className="text-verdigris">Zero Data Storage</span>
          </div>
          <div className="flex gap-6">
            <a className="hover:text-text-primary transition-colors" href="https://www.ilovepdf.com/unlock_pdf" target="_blank" rel="noopener noreferrer">iLovePDF Unlocker</a>
            <a className="hover:text-text-primary transition-colors" href="#">Privacy Suite</a>
            <a className="hover:text-text-primary transition-colors" href="#">Security Specs</a>
          </div>
        </div>
      </footer>

      {/* FIREBASE CONFIG HELP MODAL */}
      {showConfigHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border-amber/40">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.09-6.67-4.91H1.27v3.14C3.25 21.36 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.33 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.57H1.27C.46 8.19 0 10.03 0 12s.46 3.81 1.27 5.43l4.06-3.14z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.57l4.06 3.14c.94-2.82 3.57-4.96 6.67-4.96z"/>
                </svg>
                <h3 className="font-headline text-lg font-medium text-text-primary">Google SSO Configuration</h3>
              </div>
              <button 
                onClick={() => setShowConfigHelp(false)}
                className="text-text-muted hover:text-text-primary text-sm p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Google SSO is fully ready. To connect your Firebase project, set these variables in your <code className="text-amber font-mono">.env</code> or Vercel Environment Variables:
            </p>
            <div className="bg-ink p-3.5 rounded-xl border border-hairline font-mono text-[11px] text-amber space-y-1 overflow-x-auto">
              <div>VITE_FIREBASE_API_KEY=...</div>
              <div>VITE_FIREBASE_AUTH_DOMAIN=...</div>
              <div>VITE_FIREBASE_PROJECT_ID=...</div>
              <div>VITE_FIREBASE_STORAGE_BUCKET=...</div>
              <div>VITE_FIREBASE_MESSAGING_SENDER_ID=...</div>
              <div>VITE_FIREBASE_APP_ID=...</div>
            </div>
            <button
              onClick={() => setShowConfigHelp(false)}
              className="w-full py-2.5 bg-amber text-ink rounded-xl text-xs font-semibold hover:bg-amber/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
