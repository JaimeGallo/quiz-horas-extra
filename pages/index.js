import React, { useState, useEffect } from "react";
import {
  Clock,
  Target,
  Zap,
  Calculator,
  BarChart3,
  Scale,
  DollarSign,
  PhoneCall,
  CheckCircle,
} from "lucide-react";
import emailjs from "emailjs-com";

const QuizValidacion = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    probability: 3,
    benefits: [],
    budget: "",
    wantsTrial: null,
    email: "",
    name: "",
  });

  const [timeLeft, setTimeLeft] = useState(120);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CONFIGURACIÓN EMAILJS - CAMBIAR ESTOS VALORES
  const EMAILJS_CONFIG = {
    SERVICE_ID: "service_gx5zhee",
    TEMPLATE_ID: "template_oramyow",
    PUBLIC_KEY: "3aP9J25DgqyICmI7y",
  };

  useEffect(() => {
    if (currentStep > 0 && currentStep < 6 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, currentStep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const probabilityLabels = {
    1: { emoji: "😴", text: "Nada probable", color: "text-red-500" },
    2: { emoji: "😐", text: "Poco probable", color: "text-orange-500" },
    3: { emoji: "🤔", text: "Posible", color: "text-yellow-500" },
    4: { emoji: "😊", text: "Muy probable", color: "text-green-500" },
    5: { emoji: "🔥", text: "¡Súper probable!", color: "text-emerald-500" },
  };

  const benefits = [
    {
      id: "valor",
      icon: DollarSign,
      text: "Liberar tiempo para generar valor",
      color: "bg-yellow-500",
    },
    {
      id: "tiempo",
      icon: Zap,
      text: "Reducir tiempo de gestión",
      color: "bg-blue-500",
    },
    {
      id: "errores",
      icon: Calculator,
      text: "Evitar errores de cálculo",
      color: "bg-red-500",
    },
    {
      id: "reportes",
      icon: BarChart3,
      text: "Mejorar reportes y control",
      color: "bg-green-500",
    },
    {
      id: "normativas",
      icon: Scale,
      text: "Cumplir normativas laborales",
      color: "bg-purple-500",
    },
  ];

  const budgetOptions = [
    {
      value: "menos_100k",
      label: "Menos de $100.000 COP/mes",
      roi: "ROI: +300%",
    },
    {
      value: "100k_300k",
      label: "$100.000 - $300.000 COP/mes",
      roi: "ROI: +200%",
    },
    {
      value: "300k_500k",
      label: "$300.000 - $500.000 COP/mes",
      roi: "ROI: +150%",
    },
    { value: "mas_500k", label: "Más de $500.000 COP/mes", roi: "ROI: +100%" },
  ];

  const handleBenefitToggle = (benefitId) => {
    setResponses((prev) => {
      const newBenefits = prev.benefits.includes(benefitId)
        ? prev.benefits.filter((b) => b !== benefitId)
        : prev.benefits.length < 3
        ? [...prev.benefits, benefitId]
        : prev.benefits;
      return { ...prev, benefits: newBenefits };
    });
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getDiagnostico = () => {
    const { probability, benefits, budget } = responses;

    if (probability >= 4 && benefits.length >= 2) {
      return {
        title: "🚀 ALTA PROBABILIDAD DE ÉXITO",
        message:
          "Tu empresa está lista para implementar esta solución. Los beneficios que seleccionaste indican un ROI muy atractivo.",
        color: "bg-green-100 border-green-500 text-green-800",
      };
    } else if (probability >= 3) {
      return {
        title: "🎯 OPORTUNIDAD INTERESANTE",
        message:
          "Hay potencial, pero necesitas evaluar mejor los beneficios específicos para tu empresa.",
        color: "bg-yellow-100 border-yellow-500 text-yellow-800",
      };
    } else {
      return {
        title: "🤔 NECESITAS MÁS INFORMACIÓN",
        message:
          "Te recomendamos una demo personalizada para mostrarte el valor específico para tu caso.",
        color: "bg-blue-100 border-blue-500 text-blue-800",
      };
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    const diagnostico = getDiagnostico();

    const benefitTexts = responses.benefits
      .map((id) => benefits.find((b) => b.id === id)?.text)
      .filter(Boolean)
      .join(", ");

    const budgetText =
      budgetOptions.find((b) => b.value === responses.budget)?.label ||
      "No especificado";

    const templateParams = {
      name: responses.name || "No especificado",
      email: responses.email || "No especificado",
      probability: `${responses.probability}/5 (${
        probabilityLabels[responses.probability].text
      })`,
      benefits: benefitTexts || "Ninguno seleccionado",
      budget: budgetText,
      wantsTrial: responses.wantsTrial ? "Sí" : "No",
      diagnostico: diagnostico.title + " - " + diagnostico.message,
      timestamp: new Date().toLocaleString("es-CO"),
    };

    try {
      // Solo envía email si está configurado
      if (EMAILJS_CONFIG.SERVICE_ID !== "TU_SERVICE_ID") {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams,
          EMAILJS_CONFIG.PUBLIC_KEY
        );
      } else {
        // Para pruebas, muestra en consola
        console.log("Datos del quiz:", templateParams);
      }

      setIsComplete(true);
    } catch (error) {
      console.error("Error enviando datos:", error);
      // Aún así completa el quiz para no bloquear al usuario
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    const diagnostico = getDiagnostico();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div
            className={`p-8 rounded-2xl border-2 ${diagnostico.color} text-center`}
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{diagnostico.title}</h2>
            <p className="text-lg mb-6">{diagnostico.message}</p>
            {responses.wantsTrial && responses.email && (
              <div className="bg-white p-4 rounded-lg mt-4">
                <p className="font-semibold text-green-600">
                  ✅ ¡Perfecto! Te enviaremos el acceso de prueba a{" "}
                  {responses.email}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setCurrentStep(0);
                setIsComplete(false);
                setResponses({
                  probability: 3,
                  benefits: [],
                  budget: "",
                  wantsTrial: null,
                  email: "",
                  name: "",
                });
                setTimeLeft(120);
              }}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Hacer el quiz de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header con timer */}
        {currentStep > 0 && currentStep < 6 && (
          <div className="text-center mb-6 pt-4">
            <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-semibold text-blue-600">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {currentStep > 0 && currentStep < 6 && (
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Paso {currentStep} de 5
            </p>
          </div>
        )}

        {/* Pantalla 0: Inicio */}
        {currentStep === 0 && (
          <div className="text-center py-12">
            <Target className="w-24 h-24 mx-auto text-blue-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              ¿Esta solución sería útil en tu empresa?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              ⏱️ Solo te tomará <strong>2 minutos</strong>
            </p>
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Comenzar Quiz 🚀
            </button>
          </div>
        )}

        {/* Resto de pantallas igual que antes... */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              ¿Qué tan probable es que implementes esta solución en tu empresa?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Escala lineal: 1 (Nada probable) → 5 (Muy probable)
            </p>

            <div className="mb-8">
              <input
                type="range"
                min="1"
                max="5"
                value={responses.probability}
                onChange={(e) =>
                  setResponses((prev) => ({
                    ...prev,
                    probability: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl mb-2">
                {probabilityLabels[responses.probability].emoji}
              </div>
              <div
                className={`text-xl font-semibold ${
                  probabilityLabels[responses.probability].color
                }`}
              >
                {probabilityLabels[responses.probability].text}
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Pantalla 2: Beneficios */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              ¿Cuál de estos beneficios te resulta más valioso?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              ({responses.benefits.length}/3 seleccionados)
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                const isSelected = responses.benefits.includes(benefit.id);
                const isDisabled =
                  !isSelected && responses.benefits.length >= 3;

                return (
                  <button
                    key={benefit.id}
                    onClick={() => handleBenefitToggle(benefit.id)}
                    disabled={isDisabled}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : isDisabled
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-4 ${
                          isSelected ? benefit.color : "bg-gray-200"
                        }`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-medium">{benefit.text}</span>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextStep}
              disabled={responses.benefits.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Pantalla 3: Presupuesto */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              💵 ¿Cuál es tu presupuesto mensual para resolver este dolor?
            </h2>

            <div className="space-y-4 mb-8">
              {budgetOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setResponses((prev) => ({ ...prev, budget: option.value }))
                  }
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    responses.budget === option.value
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-sm text-green-600 font-semibold">
                      {option.roi}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={!responses.budget}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Pantalla 4: Trial */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <PhoneCall className="w-16 h-16 mx-auto text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-center mb-6">
              ¿Te gustaría que te contactemos para enviarte más información
              sobre la solución?
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Otras funcionalidades + soporte personalizado + descuento del 20%
              si decides implementar
            </p>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() =>
                  setResponses((prev) => ({ ...prev, wantsTrial: true }))
                }
                className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                  responses.wantsTrial === true
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ✅ ¡Sí, quiero recibir más información!
              </button>
              <button
                onClick={() =>
                  setResponses((prev) => ({ ...prev, wantsTrial: false }))
                }
                className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                  responses.wantsTrial === false
                    ? "bg-gray-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ❌ No por ahora
              </button>
            </div>

            <button
              onClick={nextStep}
              disabled={responses.wantsTrial === null}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Pantalla 5: Contacto */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              {responses.wantsTrial
                ? "📧 ¡Perfecto! Déjanos tus datos para enviarte el acceso"
                : "📧 Déjanos tu contacto para enviarte más información (opcional)"}
            </h2>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo {responses.wantsTrial && "*"}
                </label>
                <input
                  type="text"
                  value={responses.name}
                  onChange={(e) =>
                    setResponses((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email {responses.wantsTrial && "*"}
                </label>
                <input
                  type="email"
                  value={responses.email}
                  onChange={(e) =>
                    setResponses((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tu@empresa.com"
                />
              </div>
            </div>

            <button
              onClick={submitQuiz}
              disabled={
                (responses.wantsTrial &&
                  (!responses.email || !responses.name)) ||
                isSubmitting
              }
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "⏳ Enviando..." : "🎯 Ver mi diagnóstico"}
            </button>

            {!responses.wantsTrial && (
              <button
                onClick={submitQuiz}
                disabled={isSubmitting}
                className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "⏳ Enviando..." : "Saltar y ver diagnóstico"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizValidacion;
