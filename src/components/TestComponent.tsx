const TestComponent = () => {
  console.log('[TestComponent] Rendering basic test component');
  
  return (
    <div className="min-h-screen bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold">TEST COMPONENT</h1>
      <p className="text-xl mt-4">If you can see this, React is working!</p>
      <div className="mt-8">
        <p>Environment check:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>PROD: {String(import.meta.env.PROD)}</li>
          <li>VITE_CUSTOM_DOMAIN: {String(import.meta.env.VITE_CUSTOM_DOMAIN)}</li>
          <li>NODE_ENV: {String(import.meta.env.NODE_ENV)}</li>
          <li>Window hostname: {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;