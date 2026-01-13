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
} from "lucide-react";
import { SERVICES, BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/lib/constants";
import { trackFormSubmit } from "@/lib/analytics";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Brick: Home, // Fallback since Brick may not exist
  Droplets,
  Zap,
  Paintbrush,
  Grid3X3,
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
  surface: string;
  budget: string;
  timeline: string;
  city: string;
  name: string;
  phone: string;
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
    surface: "",
    budget: "",
    timeline: "",
    city: "",
    name: "",
    phone: "",
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

      // Clean up features if service is deselected
      const newFeatures = { ...prev.selectedFeatures };
      if (isSelected) {
        delete newFeatures[serviceId];
      }

      // Auto-expand the service when selected
      if (!isSelected && !expandedServices.includes(serviceId)) {
        setExpandedServices((prev) => [...prev, serviceId]);
      }

      return {
        ...prev,
        services: newServices,
        selectedFeatures: newFeatures,
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

  // Check if form can be submitted
  const canSubmit =
    formData.services.length > 0 &&
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.budget !== "" &&
    formData.timeline !== "" &&
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
            surface: "",
            budget: "",
            timeline: "",
            city: "",
            name: "",
            phone: "",
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
          <span className="quote-step-number">1</span>
          Quels services vous interessent ?
        </h3>
        <p className="quote-section-desc">
          Selectionnez un ou plusieurs services
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
                  <span className="quote-service-badge">Plus demande</span>
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

      {/* Section 2: Features per service (dynamic) */}
      {hasSelectedServices && (
        <div className="quote-section quote-section-animate">
          <h3 className="quote-section-title">
            <span className="quote-step-number">2</span>
            Precisez vos besoins
          </h3>
          <p className="quote-section-desc">
            Selectionnez les prestations concernees (optionnel)
          </p>

          <div className="quote-features-container">
            {formData.services.map((serviceId) => {
              const service = SERVICES.find((s) => s.id === serviceId);
              if (!service) return null;

              const isExpanded = expandedServices.includes(serviceId);
              const selectedCount = (formData.selectedFeatures[serviceId] || []).length;

              return (
                <div key={serviceId} className="quote-feature-group">
                  <button
                    type="button"
                    className="quote-feature-header"
                    onClick={() => toggleServiceAccordion(serviceId)}
                  >
                    <span className="quote-feature-service-name">
                      {service.title}
                      {selectedCount > 0 && (
                        <span className="quote-feature-count">{selectedCount} selectionne{selectedCount > 1 ? "s" : ""}</span>
                      )}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="quote-feature-list">
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Project Info */}
      {hasSelectedServices && (
        <div className="quote-section quote-section-animate">
          <h3 className="quote-section-title">
            <span className="quote-step-number">3</span>
            Informations sur votre projet
          </h3>

          <div className="quote-project-grid">
            <div className="quote-field">
              <label className="quote-label">Ville du chantier *</label>
              <input
                type="text"
                className="gold-input"
                placeholder="Ex: Paris 15e, Bobigny..."
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="quote-field">
              <label className="quote-label">Surface estimee (m²)</label>
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
              <label className="quote-label">Budget approximatif *</label>
              <select
                className="gold-input"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              >
                <option value="">Selectionnez votre budget</option>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="quote-field">
              <label className="quote-label">Delai souhaite *</label>
              <select
                className="gold-input"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                required
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
            <span className="quote-step-number">4</span>
            Vos coordonnees
          </h3>

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
              <label className="quote-label">Votre telephone *</label>
              <input
                type="tel"
                className="gold-input"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="quote-field quote-field-full">
            <label className="quote-label">Message complementaire (optionnel)</label>
            <textarea
              className="gold-input"
              rows={3}
              placeholder="Decrivez votre projet ou ajoutez des precisions..."
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
              J&apos;accepte que mes donnees soient utilisees pour traiter ma demande.{" "}
              <a href="/mentions-legales" target="_blank" rel="noopener noreferrer">
                Politique de confidentialite
              </a>
            </span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <div className="quote-submit-section">
        {!hasSelectedServices && (
          <p className="quote-hint">
            Selectionnez au moins un service pour continuer
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
              <span>Demande envoyee !</span>
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
          Reponse sous 24h - Sans engagement
        </p>
      </div>
    </form>
  );
}
