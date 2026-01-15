"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import {
  Home,
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
  CheckCircle,
  Loader2,
  ArrowRight,
  ChevronDown,
  TreePine,
  Waves,
  User,
  Phone,
  Mail,
  Check,
  MousePointerClick,
} from "lucide-react";
import { SERVICES, BUDGET_OPTIONS, TIMELINE_OPTIONS, ROOM_OPTIONS, SERVICE_ROOMS } from "@/lib/constants";
import { trackFormSubmit } from "@/lib/analytics";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Brick: Home, // Fallback
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
  TreePine,
  Waves,
};

// Custom Brick icon as SVG
const BrickIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="6" rx="1" />
    <rect x="1" y="14" width="22" height="6" rx="1" />
    <line x1="12" y1="4" x2="12" y2="10" />
    <line x1="6" y1="14" x2="6" y2="20" />
    <line x1="18" y1="14" x2="18" y2="20" />
  </svg>
);

interface QuoteFormData {
  services: string[];
  selectedFeatures: Record<string, string[]>;
  selectedRooms: Record<string, string[]>;
  surface: string;
  budget: string;
  timeline: string;
  city: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  rgpdAccepted: boolean;
}

interface QuoteFormProps {
  onSuccess?: () => void;
}

export default function QuoteForm({ onSuccess }: QuoteFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    services: [],
    selectedFeatures: {},
    selectedRooms: {},
    surface: "",
    budget: "",
    timeline: "",
    city: "",
    name: "",
    phone: "",
    email: "",
    message: "",
    rgpdAccepted: false,
  });

  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1]);

  // Reveal the next step (no auto-scroll)
  const revealNextStep = useCallback((currentStep: number) => {
    setVisibleSteps(prev => {
      const nextStep = currentStep + 1;
      if (nextStep <= 4 && !prev.includes(nextStep)) {
        return [...prev, nextStep];
      }
      return prev;
    });
  }, []);

  // Interaction handlers to reveal next steps
  const handleStep2Interaction = useCallback(() => {
    revealNextStep(2);
  }, [revealNextStep]);

  const handleStep3Interaction = useCallback(() => {
    revealNextStep(3);
  }, [revealNextStep]);

  // Scroll to a specific step (for progress bar navigation)
  const scrollToStep = useCallback((stepNum: number) => {
    const element = document.getElementById(`quote-step-${stepNum}`);
    if (element) {
      const headerOffset = 80; // Account for sticky progress bar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, []);

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const isSelected = prev.services.includes(serviceId);
      const newServices = isSelected
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId];

      // Clean up features and rooms if service is deselected
      const newFeatures = { ...prev.selectedFeatures };
      const newRooms = { ...prev.selectedRooms };
      if (isSelected) {
        delete newFeatures[serviceId];
        delete newRooms[serviceId];
      }

      // Auto-expand the service when selected
      if (!isSelected && !expandedServices.includes(serviceId)) {
        setExpandedServices((prev) => [...prev, serviceId]);
      }

      // Reveal step 2 when selecting a service (not deselecting)
      if (!isSelected) {
        revealNextStep(1);
      }

      return {
        ...prev,
        services: newServices,
        selectedFeatures: newFeatures,
        selectedRooms: newRooms,
      };
    });
  };

  // Toggle feature selection
  const toggleFeature = (serviceId: string, feature: string) => {
    setFormData((prev) => {
      const serviceFeatures = prev.selectedFeatures[serviceId] || [];
      const isSelected = serviceFeatures.includes(feature);

      return {
        ...prev,
        selectedFeatures: {
          ...prev.selectedFeatures,
          [serviceId]: isSelected
            ? serviceFeatures.filter((f) => f !== feature)
            : [...serviceFeatures, feature],
        },
      };
    });
  };

  // Toggle room selection
  const toggleRoom = (serviceId: string, room: string) => {
    setFormData((prev) => {
      const serviceRooms = prev.selectedRooms[serviceId] || [];
      const isSelected = serviceRooms.includes(room);

      return {
        ...prev,
        selectedRooms: {
          ...prev.selectedRooms,
          [serviceId]: isSelected
            ? serviceRooms.filter((r) => r !== room)
            : [...serviceRooms, room],
        },
      };
    });
  };

  // Toggle service accordion
  const toggleServiceAccordion = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Get icon component
  const getIcon = (iconName: string) => {
    if (iconName === "Brick") return BrickIcon;
    return iconMap[iconName] || Home;
  };

  // Get applicable rooms for a service
  const getServiceRooms = (serviceId: string) => {
    const roomIds = SERVICE_ROOMS[serviceId] || [];
    return ROOM_OPTIONS.filter((room) => roomIds.includes(room.value));
  };

  // Check if form can be submitted
  // Required: services, name, (phone OR email), rgpdAccepted
  const canSubmit =
    formData.services.length > 0 &&
    formData.name.trim() !== "" &&
    (formData.phone.trim() !== "" || formData.email.trim() !== "") &&
    formData.rgpdAccepted;

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setFormStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormMessage(data.message);
        trackFormSubmit("quote_form_qualified");
        onSuccess?.();

        // Reset form after success
        setTimeout(() => {
          setFormData({
            services: [],
            selectedFeatures: {},
            selectedRooms: {},
            surface: "",
            budget: "",
            timeline: "",
            city: "",
            name: "",
            phone: "",
            email: "",
            message: "",
            rgpdAccepted: false,
          });
          setExpandedServices([]);
          setFormStatus("idle");
          setFormMessage("");
        }, 3000);
      } else {
        setFormStatus("error");
        setFormMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setFormStatus("error");
      setFormMessage("Erreur de connexion. Veuillez réessayer.");
    }
  };

  const hasSelectedServices = formData.services.length > 0;

  // Reset visible steps when all services are deselected
  useEffect(() => {
    if (!hasSelectedServices) {
      setVisibleSteps([1]);
    }
  }, [hasSelectedServices]);

  // Check section completion
  const isStep1Complete = hasSelectedServices;
  const isStep4Complete =
    formData.name.trim() !== "" &&
    (formData.phone.trim() !== "" || formData.email.trim() !== "");

  // Progress bar: 4 dots at 0%, 33%, 66%, 100% (space-between)
  // Fill follows the visible steps progression
  const getProgressPercent = () => {
    if (!isStep1Complete) return 0;               // Avant step 1
    if (isStep4Complete) return 100;              // Step 4 complet → fin
    if (visibleSteps.includes(4)) return 66;      // Step 4 visible → atteint dot 3
    return 33;                                    // Step 1 complet → atteint dot 2
  };

  const progressPercent = getProgressPercent();

  // Progress bar labels
  const steps = [
    { num: 1, label: "Services" },
    { num: 2, label: "Détails" },
    { num: 3, label: "Projet" },
    { num: 4, label: "Contact" },
  ];

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      {/* Progress Bar - sticky when form started */}
      <div className={`quote-progress ${hasSelectedServices ? "quote-progress-sticky" : ""}`}>
        <div className="quote-progress-track">
          <div
            className="quote-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="quote-progress-steps">
          {steps.map((step) => {
            // Steps 2 et 3 sont optionnels, on les marque comme "actifs" (pas completed) quand on y est
            const isCompleted =
              (step.num === 1 && isStep1Complete) ||
              (step.num === 4 && isStep4Complete);
            const isVisible = visibleSteps.includes(step.num);
            const isClickable = isVisible;

            return (
              <button
                key={step.num}
                type="button"
                className={`quote-progress-step ${isVisible ? "active" : ""} ${isCompleted ? "completed" : ""} ${isClickable ? "clickable" : ""}`}
                onClick={() => isClickable && scrollToStep(step.num)}
                disabled={!isClickable}
              >
                <div className="quote-progress-dot">
                  {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className="quote-progress-label">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Service Selection */}
      <div id="quote-step-1" className={`quote-section ${isStep1Complete ? "quote-section-complete" : ""}`}>
        <h3 className="quote-section-title">
          <span className="quote-step-badge">
            <span className="quote-step-current">1</span>
            <span className="quote-step-separator">/</span>
            <span className="quote-step-total">4</span>
          </span>
          Quels services vous intéressent ? *
          {isStep1Complete && (
            <span className="quote-section-check">
              <Check />
            </span>
          )}
        </h3>
        <p className="quote-section-desc">
          Sélectionnez un ou plusieurs services
        </p>

        <div className="quote-services-grid">
          {SERVICES.map((service) => {
            const Icon = getIcon(service.icon);
            const isSelected = formData.services.includes(service.id);

            return (
              <button
                key={service.id}
                type="button"
                className={`quote-service-card ${isSelected ? "quote-service-selected" : ""}`}
                onClick={() => toggleService(service.id)}
              >
                {service.popular && (
                  <span className="quote-service-badge">Plus demandé</span>
                )}
                <div className="quote-service-check">
                  {isSelected && <CheckCircle className="w-5 h-5" />}
                </div>
                <Icon className="quote-service-icon" />
                <span className="quote-service-title">{service.title}</span>
              </button>
            );
          })}
        </div>

        {/* Continue indicator when step 2 is available */}
        {isStep1Complete && visibleSteps.includes(2) && (
          <div className="quote-continue-hint">
            <ChevronDown className="w-5 h-5" />
            <span>Continuez ci-dessous</span>
          </div>
        )}
      </div>

      {/* Section 2: Rooms & Features per service (dynamic) */}
      {visibleSteps.includes(2) && (
        <div id="quote-step-2" className="quote-section quote-section-animate">
          <h3 className="quote-section-title">
            <span className="quote-step-badge">
              <span className="quote-step-current">2</span>
              <span className="quote-step-separator">/</span>
              <span className="quote-step-total">4</span>
            </span>
            Précisez vos besoins
          </h3>
          <p className="quote-section-desc">
            Sélectionnez les pièces et prestations concernées (optionnel)
          </p>

          <div className="quote-features-container">
            {formData.services.map((serviceId) => {
              const service = SERVICES.find((s) => s.id === serviceId);
              if (!service) return null;

              const isExpanded = expandedServices.includes(serviceId);
              const selectedFeatureCount = (formData.selectedFeatures[serviceId] || []).length;
              const selectedRoomCount = (formData.selectedRooms[serviceId] || []).length;
              const totalCount = selectedFeatureCount + selectedRoomCount;
              const applicableRooms = getServiceRooms(serviceId);

              return (
                <div key={serviceId} className="quote-feature-group">
                  <button
                    type="button"
                    className="quote-feature-header"
                    onClick={() => { toggleServiceAccordion(serviceId); handleStep2Interaction(); }}
                    aria-expanded={isExpanded}
                  >
                    <span className="quote-feature-service-name">
                      {service.title}
                      {totalCount > 0 && (
                        <span className="quote-feature-count">{totalCount} sélectionné{totalCount > 1 ? "s" : ""}</span>
                      )}
                    </span>
                    <ChevronDown className="w-5 h-5" />
                  </button>

                  {isExpanded && (
                    <div className="quote-feature-content">
                      {/* Room Selection */}
                      {applicableRooms.length > 0 && (
                        <div className="quote-rooms-section">
                          <p className="quote-rooms-label">Pièces concernées :</p>
                          <div className="quote-rooms-grid">
                            {applicableRooms.map((room) => {
                              const isChecked = (formData.selectedRooms[serviceId] || []).includes(room.value);

                              return (
                                <label key={room.value} className="quote-room-item">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => { toggleRoom(serviceId, room.value); handleStep2Interaction(); }}
                                  />
                                  <span className="quote-room-checkbox">
                                    {isChecked && <CheckCircle className="w-3 h-3" />}
                                  </span>
                                  <span className="quote-room-label">{room.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Features Selection */}
                      <div className="quote-feature-list">
                        <p className="quote-rooms-label">Prestations :</p>
                        <div className="quote-features-grid">
                          {service.features.map((feature) => {
                            const isChecked = (formData.selectedFeatures[serviceId] || []).includes(feature);

                            return (
                              <label key={feature} className="quote-feature-item">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => { toggleFeature(serviceId, feature); handleStep2Interaction(); }}
                                />
                                <span className="quote-feature-checkbox">
                                  {isChecked && <CheckCircle className="w-4 h-4" />}
                                </span>
                                <span className="quote-feature-label">{feature}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Skip button for step 2 */}
          {!visibleSteps.includes(3) && (
            <button
              type="button"
              className="quote-skip-btn"
              onClick={() => revealNextStep(2)}
            >
              Passer cette étape <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Section 3: Project Info (optional) */}
      {visibleSteps.includes(3) && (
        <div id="quote-step-3" className="quote-section quote-section-animate">
          <h3 className="quote-section-title">
            <span className="quote-step-badge">
              <span className="quote-step-current">3</span>
              <span className="quote-step-separator">/</span>
              <span className="quote-step-total">4</span>
            </span>
            Informations sur votre projet
          </h3>
          <p className="quote-section-desc">
            Ces informations sont optionnelles mais nous aident à mieux vous répondre
          </p>

          <div className="quote-project-grid">
            <div className="quote-field">
              <label className="quote-label">Ville du chantier</label>
              <input
                type="text"
                className="gold-input"
                placeholder="Ex: Paris 15e, Bobigny..."
                value={formData.city}
                onFocus={handleStep3Interaction}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="quote-field">
              <label className="quote-label">Surface estimée (m²)</label>
              <input
                type="number"
                className="gold-input"
                placeholder="Ex: 45"
                min="0"
                value={formData.surface}
                onFocus={handleStep3Interaction}
                onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
              />
            </div>

            <div className="quote-field">
              <label className="quote-label">Budget approximatif</label>
              <select
                className="gold-input"
                value={formData.budget}
                onFocus={handleStep3Interaction}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              >
                <option value="">Sélectionnez votre budget</option>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="quote-field">
              <label className="quote-label">Délai souhaité</label>
              <select
                className="gold-input"
                value={formData.timeline}
                onFocus={handleStep3Interaction}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              >
                <option value="">Quand souhaitez-vous commencer ?</option>
                {TIMELINE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skip button for step 3 */}
          {!visibleSteps.includes(4) && (
            <button
              type="button"
              className="quote-skip-btn"
              onClick={() => revealNextStep(3)}
            >
              Passer cette étape <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Section 4: Contact Info */}
      {visibleSteps.includes(4) && (
        <div id="quote-step-4" className={`quote-section quote-section-animate ${isStep4Complete ? "quote-section-complete" : ""}`}>
          <h3 className="quote-section-title">
            <span className="quote-step-badge">
              <span className="quote-step-current">4</span>
              <span className="quote-step-separator">/</span>
              <span className="quote-step-total">4</span>
            </span>
            Vos coordonnées *
            {isStep4Complete && (
              <span className="quote-section-check">
                <Check />
              </span>
            )}
          </h3>
          <p className="quote-section-desc">
            Téléphone ou email obligatoire
          </p>

          <div className="quote-contact-grid">
            <div className={`quote-field quote-field-enhanced ${formData.name.trim() ? "quote-field-valid" : ""}`}>
              <User className="w-4 h-4 quote-field-icon" />
              <input
                type="text"
                className="gold-input"
                placeholder=" "
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <label className="quote-label">Votre nom *</label>
            </div>

            <div className={`quote-field quote-field-enhanced ${formData.phone.trim() ? "quote-field-valid" : ""}`}>
              <Phone className="w-4 h-4 quote-field-icon" />
              <input
                type="tel"
                className="gold-input"
                placeholder=" "
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <label className="quote-label">Votre téléphone</label>
            </div>

            <div className={`quote-field quote-field-enhanced ${formData.email.trim() ? "quote-field-valid" : ""}`}>
              <Mail className="w-4 h-4 quote-field-icon" />
              <input
                type="email"
                className="gold-input"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label className="quote-label">Votre email</label>
            </div>
          </div>

          {formData.phone.trim() === "" && formData.email.trim() === "" && (
            <p className="quote-contact-hint">
              Veuillez renseigner au moins un moyen de contact (téléphone ou email)
            </p>
          )}

          <div className="quote-field quote-field-full">
            <label className="quote-label">Message complémentaire (optionnel)</label>
            <textarea
              className="gold-input"
              rows={3}
              placeholder="Décrivez votre projet ou ajoutez des précisions..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <label className="gold-checkbox">
            <input
              type="checkbox"
              checked={formData.rgpdAccepted}
              onChange={(e) => setFormData({ ...formData, rgpdAccepted: e.target.checked })}
              required
            />
            <span className="gold-checkbox-mark" />
            <span className="gold-checkbox-text">
              J&apos;accepte que mes données soient utilisées pour traiter ma demande.{" "}
              <a href="/mentions-legales" target="_blank" rel="noopener noreferrer">
                Politique de confidentialité
              </a>
            </span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <div className="quote-submit-section">
        {!hasSelectedServices && (
          <div className="quote-empty-state">
            <MousePointerClick className="quote-empty-icon" />
            <p className="quote-empty-text">
              Sélectionnez un ou plusieurs services ci-dessus pour commencer votre demande de devis
            </p>
          </div>
        )}

        <button
          type="submit"
          className={`gold-btn-primary gold-btn-full ${canSubmit && formStatus === "idle" ? "quote-btn-ready" : ""} ${formStatus === "success" ? "quote-btn-success" : ""}`}
          disabled={!canSubmit || formStatus === "loading"}
        >
          {formStatus === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : formStatus === "success" ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Demande envoyée !</span>
            </>
          ) : (
            <>
              <span>Recevoir mon devis gratuit sous 24h</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {formMessage && (
          <p className={`gold-form-message ${formStatus === "error" ? "gold-form-error" : "gold-form-success"}`}>
            {formMessage}
          </p>
        )}

        <p className="gold-form-reassurance">
          Réponse sous 24h - Sans engagement
        </p>
      </div>
    </form>
  );
}
