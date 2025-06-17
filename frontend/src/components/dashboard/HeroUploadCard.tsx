import { useRef, useState } from 'react';

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <span className="text-red-500 text-3xl">📄</span>,
  xls: <span className="text-green-500 text-3xl">📊</span>,
  doc: <span className="text-blue-500 text-3xl">📝</span>,
  default: <span className="text-gray-400 text-3xl">📁</span>,
};

interface ExtractedField {
  value: string;
  confidence: number;
}

export default function HeroUploadCard() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    if (droppedFiles[0]) {
      console.log('File dropped:', droppedFiles[0]);
      uploadAndAnalyze(droppedFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files);
      setFiles(fileArr);
      if (fileArr[0]) {
        console.log('File selected:', fileArr[0]);
        uploadAndAnalyze(fileArr[0]);
      }
    }
  };

  // Mock: get auth token (replace with real auth)
  const getToken = () => localStorage.getItem('token') || '';

  // Step 1: Create a form, Step 2: Analyze the PDF
  const uploadAndAnalyze = async (file: File) => {
    setProgress(0);
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      // 1. Create a new form (minimal fields for demo)
      const formRes = await fetch('/api/v1/forms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: file.name,
          description: 'Uploaded via dashboard',
          status: 'pending',
        }),
      });
      if (!formRes.ok) {
        const err = await formRes.json();
        setError(err.detail || 'Failed to create form');
        setLoading(false);
        return;
      }
      const formData = await formRes.json();
      const formId = formData.id || formData.form_id || formData._id;
      if (!formId) {
        setError('Form ID not returned from backend');
        setLoading(false);
        return;
      }
      // 2. Analyze the PDF for this form
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      let val = 0;
      const interval = setInterval(() => {
        val += 10;
        setProgress(val);
        if (val >= 90) clearInterval(interval);
      }, 100);
      const res = await fetch(`/api/v1/forms/${formId}/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formDataObj,
      });
      clearInterval(interval);
      setProgress(100);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || err.detail || 'Upload failed');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative col-span-2 min-h-[220px] rounded-xl shadow-xl transition-all duration-200 cursor-pointer overflow-hidden ${
        dragActive ? 'ring-4 ring-blue-400' : ''
      }`}
      style={{
        background: 'linear-gradient(120deg, rgba(0,82,255,0.85) 0%, rgba(30,64,175,0.85) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={0}
      aria-label="Upload New Form"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        aria-label="Upload files"
        accept="application/pdf"
      />
      <div
        className="absolute inset-0 bg-white/10 pointer-events-none"
        style={{ backdropFilter: 'blur(8px)' }}
      />
      <div className="relative z-10 flex flex-col h-full justify-center items-center p-8 text-center w-full">
        <div className="flex gap-2 mb-4">
          {files.length === 0 ? (
            <span className="text-5xl text-white/80 animate-bounce">⬆️</span>
          ) : (
            files.map((file, i) => {
              const ext = file.name.split('.').pop()?.toLowerCase() || 'default';
              return <span key={i}>{fileIcons[ext] || fileIcons.default}</span>;
            })
          )}
        </div>
        <div className="text-2xl font-bold text-white drop-shadow mb-2">Upload OSHA PDF</div>
        <div className="text-white/80 text-sm mb-4">
          Drag OSHA 300/300A/301 PDF here or <span className="underline">click to browse</span>
        </div>
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-blue-400 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {progress === 100 && loading && (
          <div className="text-blue-200 mt-2 font-semibold">Analyzing...</div>
        )}
        {error && <div className="text-red-200 mt-2 font-semibold">{error}</div>}
        {analysis && (
          <div className="w-full mt-4 bg-white/10 rounded-lg p-4 text-left text-white/90 shadow-inner">
            <div className="font-semibold mb-2">Extracted Data</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(analysis.extracted.fields).map(
                ([field, val]: [string, ExtractedField]) => (
                  <div key={field} className="flex items-center gap-2">
                    <span className="font-medium">{field}:</span>
                    <span>
                      {val.value || <span className="italic text-red-200">(missing)</span>}
                    </span>
                    <span className="text-xs ml-2">({Math.round(val.confidence * 100)}%)</span>
                  </div>
                )
              )}
            </div>
            <div className="mt-2 text-xs text-white/70">
              Form type: {analysis.extracted.form_type}
            </div>
            <div className="mt-2 text-xs text-white/70">
              Completion: {analysis.completion_percentage}%
            </div>
            {analysis.missing_fields.missing.length > 0 && (
              <div className="mt-2 text-xs text-yellow-200">
                Missing: {analysis.missing_fields.missing.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
