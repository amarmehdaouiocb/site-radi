"use client";

import { useState, FormEvent } from "react";
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
  ChevronUp,
  TreePine,
  Waves,
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

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      {/* Section 1: Service Selection */}
      <div className="quote-section">
        <h3 className="quote-section-title">
          <span className="quote-step-badge">
            <span className="quote-step-current">1</span>
            <span className="quote-step-separator">/</span>
            <span className="quote-step-total">4</span>
          </span>
          Quels services vous intéressent ? *
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
      </div>

      {/* Section 2: Rooms & Features per service (dynamic) */}
      {hasSelectedServices && (
        <div className="quote-section quote-section-animate">
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
                    onClick={() => toggleServiceAccordion(serviceId)}
                  >
                    <span className="quote-feature-service-name">
                      {service.title}
                      {totalCount > 0 && (
                        <span className="quote-feature-count">{totalCount} sélectionné{totalCount > 1 ? "s" : ""}</span>
                      )}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
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
                                    onChange={() => toggleRoom(serviceId, room.value)}
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
                                  onChange={() => toggleFeature(serviceId, feature)}
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
        </div>
      )}

      {/* Section 3: Project Info (optional) */}
      {hasSelectedServices && (
        <div className="quote-section quote-section-animate">
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
                onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
              />
            </div>

            <div className="quote-field">
              <label className="quote-label">Budget approximatif</label>
              <select
                className="gold-input"
                value={formData.budget}
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
        </div>
      )}

      {/* Section 4: Contact Info */}
      {hasSelectedServices && (
        <div className="quote-section quote-section-animate">
          <h3 className="quote-section-title">
            <span className="quote-step-badge">
              <span className="quote-step-current">4</span>
              <span className="quote-step-separator">/</span>
              <span className="quote-step-total">4</span>
            </span>
            Vos coordonnées *
          </h3>
          <p className="quote-section-desc">
            Téléphone ou email obligatoire
          </p>

          <div className="quote-contact-grid">
            <div className="quote-field">
              <label className="quote-label">Votre nom *</label>
              <input
                type="text"
                className="gold-input"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="quote-field">
              <label className="quote-label">Votre téléphone</label>
              <input
                type="tel"
                className="gold-input"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="quote-field">
              <label className="quote-label">Votre email</label>
              <input
                type="email"
                className="gold-input"
                placeholder="jean.dupont@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
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
          <p className="quote-hint">
            Sélectionnez au moins un service pour continuer
          </p>
        )}

        <button
          type="submit"
          className="gold-btn-primary gold-btn-full"
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
