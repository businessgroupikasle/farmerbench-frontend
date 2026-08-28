import React from 'react';

export const AboutStory: React.FC = () => {
  return (
    <section className="container agriflow-story-section">
      <div>
        <span className="agriflow-story-tag">
          Our Story
        </span>
        <h2 className="agriflow-story-title">
          From Rolling Highlands to Your Kitchen Table
        </h2>
        <p className="agriflow-story-p">
          AgriFlow was founded on a simple conviction: the best nourishment comes straight from healthy, living soil. We started by uniting family farms in the high mountain valleys, championing natural cultivation methods that respect biodiversity and seasonal cycles.
        </p>
        <p className="agriflow-story-p" style={{ marginBottom: 0 }}>
          Today, we connect conscious consumers with trusted growers, delivering uncompromised organic produce, heritage grains, artisan pantry staples, and cold-pressed elixirs with zero chemical compromise.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&auto=format&fit=crop&q=80"
          alt="Lush green farmlands"
          className="agriflow-story-img"
        />
      </div>
    </section>
  );
};

export default AboutStory;
