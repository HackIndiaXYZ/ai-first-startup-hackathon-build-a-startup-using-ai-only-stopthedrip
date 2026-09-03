import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/*
  StopTheDrip — hero + audit ledger
  Design tokens
  color:   ink #12151C, surface #181C25, hairline #2B303B,
           text-primary #ECEEF3, text-muted #8A93A3,
           verdigris (oxidized copper — leak/flow) #6FA88C,
           amber (leak amount) #D99A4E
  type:    Newsreader (serif, headline) / Inter (data, body)
  layout:  left-aligned ledger, asymmetric hero split
*/

const CATEGORIES = [
  { name: "Streaming", amount: 41.97, of: 128.4 },
  { name: "Software", amount: 34.98, of: 128.4 },
  { name: "Fitness", amount: 29.99, of: 128.4 },
  { name: "Cloud storage", amount: 21.46, of: 128.4 },
];

const LEDGER = [
  {
    merchant: "Vidstream Plus",
    amount: 15.99,
    cadence: "monthly",
    kind: "subscription",
    confidence: 0.96,
    note: "Last opened 4 months ago.",
    steps: [
      "Open Vidstream Plus, go to Account settings.",
      "Select Membership, then Cancel membership.",
      "Confirm — access continues until the period ends.",
    ],
  },
  {
    merchant: "CloudVault Pro",
    amount: 9.99,
    cadence: "monthly",
    kind: "subscription",
    confidence: 0.91,
    note: "Storage usage is under 2% of plan.",
    steps: [
      "Sign in to CloudVault, open Billing.",
      "Choose Downgrade plan or Cancel subscription.",
      "Export any files you want to keep first.",
    ],
  },
  {
    merchant: "FitTrack Studio",
    amount: 29.99,
    cadence: "monthly",
    kind: "subscription",
    confidence: 0.88,
    note: "No check-ins recorded in 11 weeks.",
    steps: [
      "Open the FitTrack app, tap your profile icon.",
      "Go to Subscription, then Manage plan.",
      "Tap Cancel plan and confirm.",
    ],
  },
];

function formatUSD(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function DripCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth || 300;
    const height = mount.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // pipe joint — a low-poly torus, the "source" of the leak
    const pipeGeo = new THREE.TorusGeometry(1.15, 0.16, 16, 48);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x6fa88c,
      metalness: 0.35,
      roughness: 0.45,
      wireframe: false,
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.x = Math.PI / 2.4;
    pipe.position.y = 1.4;
    scene.add(pipe);

    const wireGeo = new THREE.TorusGeometry(1.4, 0.01, 8, 48);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x2b303b });
    const wireRing = new THREE.Mesh(wireGeo, wireMat);
    wireRing.rotation.x = Math.PI / 2.4;
    wireRing.position.y = 1.4;
    scene.add(wireRing);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd99a4e, 0.4);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    // drops
    const dropGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0xd99a4e,
      metalness: 0.1,
      roughness: 0.25,
      transparent: true,
    });

    const drops = [];
    const DROP_COUNT = 6;
    for (let i = 0; i < DROP_COUNT; i++) {
      const mesh = new THREE.Mesh(dropGeo, dropMat.clone());
      mesh.visible = false;
      scene.add(mesh);
      drops.push({
        mesh,
        y: 1.1,
        active: false,
        delay: i * (1.9 / DROP_COUNT),
      });
    }

    let elapsed = 0;
    let raf;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      elapsed += dt;

      pipe.rotation.z += dt * 0.15;
      wireRing.rotation.z += dt * 0.15;

      drops.forEach((d) => {
        const t = (elapsed - d.delay) % 1.9;
        if (t < 0) {
          d.mesh.visible = false;
          return;
        }
        d.mesh.visible = true;
        const fallProgress = Math.min(t / 1.5, 1);
        const y = 1.1 - fallProgress * fallProgress * 2.6;
        d.mesh.position.set(0, y, 0);
        const stretch = 1 + fallProgress * 0.6;
        d.mesh.scale.set(1 / stretch, stretch, 1 / stretch);
        d.mesh.material.opacity = t < 1.5 ? 1 : Math.max(0, 1 - (t - 1.5) / 0.4);
      });

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      pipeGeo.dispose();
      pipeMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      dropGeo.dispose();
      dropMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

function CategoryBar({ name, amount, of }) {
  const pct = Math.round((amount / of) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          color: "#8A93A3",
          marginBottom: 6,
        }}
      >
        <span>{name}</span>
        <span style={{ color: "#ECEEF3" }}>{formatUSD(amount)}/mo</span>
      </div>
      <div style={{ height: 3, background: "#232833", borderRadius: 0 }}>
        <div
          style={{
            height: 3,
            width: `${pct}%`,
            background: "#6FA88C",
          }}
        />
      </div>
    </div>
  );
}

function LedgerRow({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: "1px solid #2B303B" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "18px 0",
          boxSizing: "border-box",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Newsreader, serif",
              fontSize: 18,
              color: "#ECEEF3",
            }}
          >
            {item.merchant}
          </div>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "#8A93A3",
              marginTop: 3,
            }}
          >
            {item.kind} · {item.cadence} · {Math.round(item.confidence * 100)}% confidence
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "#D99A4E",
            }}
          >
            {formatUSD(item.amount)}
          </span>
          <span
            style={{
              display: "inline-block",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 160ms ease",
              color: "#8A93A3",
              fontSize: 20,
              lineHeight: "20px",
            }}
          >
            +
          </span>
        </div>
      </button>
      {open && (
        <div style={{ padding: "0 0 20px 0" }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#8A93A3",
              margin: "0 0 12px 0",
            }}
          >
            {item.note}
          </p>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {item.steps.map((s, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#ECEEF3",
                  marginBottom: 6,
                }}
              >
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function StopTheDripHero() {
  const monthlyTotal = LEDGER.reduce((s, i) => s + i.amount, 0);
  const annualTotal = monthlyTotal * 12;

  return (
    <div
      style={{
        background: "#12151C",
        color: "#ECEEF3",
        padding: "56px 40px",
        borderRadius: 4,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&display=swap');
      `}</style>

      {/* hero */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 32,
          alignItems: "center",
          paddingBottom: 40,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Newsreader, serif",
              fontWeight: 400,
              fontSize: 44,
              lineHeight: 1.15,
              margin: "0 0 18px 0",
              maxWidth: 480,
            }}
          >
            Every month, something drips out unnoticed.
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "#8A93A3",
              lineHeight: 1.6,
              maxWidth: 420,
              margin: "0 0 28px 0",
            }}
          >
            Upload a statement. StopTheDrip finds the subscriptions and fees
            you forgot about, and tells you exactly how to stop them —
            without ever storing the file.
          </p>
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <div
                style={{
                  fontFamily: "Newsreader, serif",
                  fontSize: 32,
                  color: "#D99A4E",
                }}
              >
                {formatUSD(monthlyTotal)}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#8A93A3",
                  marginTop: 2,
                }}
              >
                leaking every month
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Newsreader, serif",
                  fontSize: 32,
                  color: "#ECEEF3",
                }}
              >
                {formatUSD(annualTotal)}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#8A93A3",
                  marginTop: 2,
                }}
              >
                per year, if untouched
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 320 }}>
          <DripCanvas />
        </div>
      </div>

      {/* category breakdown */}
      <div style={{ borderTop: "1px solid #2B303B", paddingTop: 32 }}>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "#8A93A3",
            marginBottom: 18,
          }}
        >
          Spend by category
        </div>
        {CATEGORIES.map((c) => (
          <CategoryBar key={c.name} {...c} />
        ))}
      </div>

      {/* ledger */}
      <div style={{ marginTop: 32 }}>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "#8A93A3",
          }}
        >
          Charges found
        </div>
        {LEDGER.map((item) => (
          <LedgerRow key={item.merchant} item={item} />
        ))}
      </div>
    </div>
  );
}
