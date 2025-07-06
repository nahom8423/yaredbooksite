export default function WelcomeScreen({ onSendMessage }) {
  const suggestions = [
    {
      title: "Ethiopian Orthodox Calendar",
      description: "Explain the Ethiopian calendar and its significance in Orthodox tradition"
    },
    {
      title: "Saint Yared and Zema",
      description: "Tell me about Saint Yared and his contributions to liturgical music"
    },
    {
      title: "Fasting Traditions",
      description: "What are the major fasting periods in Ethiopian Orthodox faith?"
    },
    {
      title: "Timkat Celebration",
      description: "Describe the significance and traditions of Timkat (Epiphany)"
    }
  ];

  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 32px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: '32px',
          color: 'white',
          fontWeight: '600',
          fontFamily: 'Noto Serif Ethiopic, serif'
        }}>ዜ</span>
      </div>
      
      <h1 style={{
        fontSize: '48px',
        fontWeight: '600',
        marginBottom: '16px',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        How can I help you today?
      </h1>
      
      <div style={{
        fontSize: '18px',
        marginBottom: '48px',
        color: '#b4b4b4'
      }}>
        Ask me about Ethiopian Orthodox tradition, liturgy, history, and theology
      </div>
      
      {/* Suggestions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        maxWidth: '768px',
        margin: '0 auto'
      }}>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => onSendMessage(suggestion.title)}
            style={{
              padding: '16px',
              textAlign: 'left',
              borderRadius: '12px',
              border: '1px solid #2d2d2d',
              backgroundColor: '#1f1f1f',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2a2a2a';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1f1f1f';
              e.target.style.borderColor = '#2d2d2d';
            }}
          >
            <div style={{
              fontWeight: '500',
              marginBottom: '8px',
              color: 'white'
            }}>
              {suggestion.title}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#b4b4b4'
            }}>
              {suggestion.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}