import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="particles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true },

        background: {
          color: "#020617",
        },

        fpsLimit: 60,

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            repulse: {
              distance: 180,
            },
          },
        },

        particles: {
          shadow: {
            enable: true,
            color: "#00ffff",
            blur: 8,
          },

          color: {
            value: ["#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00"],
          },

          links: {
            enable: true,
            color: "random",
            distance: 160,
            opacity: 0.4,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1.7,
            direction: "none",
            outModes: {
              default: "bounce",
            },
          },

          number: {
            value: 90,
            density: {
              enable: true,
              area: 800,
            },
          },

          opacity: {
            value: { min: 0.4, max: 0.8 },
          },

          size: {
            value: { min: 2, max: 5 },
          },

          shape: {
            type: "circle",
          },
        },
      }}
    />
  );
}
