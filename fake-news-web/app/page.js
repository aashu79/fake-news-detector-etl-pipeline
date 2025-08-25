"use client";
import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Loader,
  Shield,
  AlertTriangle,
  Search,
  FileText,
  TrendingUp,
} from "lucide-react";

const FakeNewsDetector = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const minCharacters = 50;

  const analyzeNews = async () => {
    if (text.length < minCharacters) {
      setError(`Please enter at least ${minCharacters} characters`);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Failed to analyze. Please ensure the API server is running on localhost:8000"
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = (prediction) => {
    if (
      prediction?.toLowerCase().includes("fake") ||
      prediction?.toLowerCase().includes("false")
    ) {
      return {
        bg: "from-red-500 to-rose-500",
        cardBg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-500",
        title: "text-red-700",
        text: "text-red-600",
        accent: "bg-red-500",
      };
    } else if (
      prediction?.toLowerCase().includes("real") ||
      prediction?.toLowerCase().includes("true")
    ) {
      return {
        bg: "from-emerald-500 to-green-500",
        cardBg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-500",
        title: "text-green-700",
        text: "text-green-600",
        accent: "bg-green-500",
      };
    }
    return {
      bg: "from-amber-500 to-yellow-500",
      cardBg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      title: "text-yellow-700",
      text: "text-yellow-600",
      accent: "bg-yellow-500",
    };
  };

  const getResultIcon = (prediction) => {
    if (
      prediction?.toLowerCase().includes("fake") ||
      prediction?.toLowerCase().includes("false")
    ) {
      return <AlertTriangle className="w-7 h-7" />;
    } else if (
      prediction?.toLowerCase().includes("real") ||
      prediction?.toLowerCase().includes("true")
    ) {
      return <CheckCircle className="w-7 h-7" />;
    }
    return <AlertCircle className="w-7 h-7" />;
  };

  const getResultMessage = (prediction) => {
    if (
      prediction?.toLowerCase().includes("fake") ||
      prediction?.toLowerCase().includes("false")
    ) {
      return {
        title: "Potentially Fake News Detected",
        description:
          "Our analysis suggests this content may contain misleading information. Please verify with trusted sources.",
      };
    } else if (
      prediction?.toLowerCase().includes("real") ||
      prediction?.toLowerCase().includes("true")
    ) {
      return {
        title: "Content Appears Legitimate",
        description:
          "This content shows characteristics of reliable news. However, always cross-reference with multiple sources.",
      };
    }
    return {
      title: "Analysis Complete",
      description:
        "Review the results below and verify with additional sources.",
    };
  };

  const resultStyle = result ? getResultStyle(result.prediction) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-200/50 mb-8 transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-10 h-10 text-slate-700" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-6 tracking-tight">
            News Authenticity Analyzer
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered analysis to help identify potentially misleading
            news content. Enter your text below for instant verification.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Text Analysis
            </h3>
            <p className="text-slate-600 text-sm">Advanced NLP processing</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Accuracy Score
            </h3>
            <p className="text-slate-600 text-sm">Confidence measurement</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Real-time Check
            </h3>
            <p className="text-slate-600 text-sm">Instant verification</p>
          </div>
        </div>

        {/* Main Analysis Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
          {/* Input Section */}
          <div className="p-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Content Analysis
              </h2>
            </div>

            <div className="relative mb-8">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError("");
                }}
                placeholder="Paste your news article, social media post, or any text content you want to verify. The more context you provide, the more accurate our analysis will be..."
                className="w-full h-56 px-6 py-5 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 resize-none text-base leading-relaxed"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    text.length >= minCharacters
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {text.length} / {minCharacters} characters
                </div>
                {text.length >= minCharacters && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-400 rounded-r-xl flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">
                    Validation Error
                  </h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={analyzeNews}
              disabled={loading || text.length < minCharacters}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-4 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Analyzing Content...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  <span className="text-lg">Analyze for Authenticity</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          {result && (
            <div className="border-t-2 border-slate-100">
              <div className={`p-10 ${resultStyle.cardBg}`}>
                <div
                  className={`bg-gradient-to-r ${resultStyle.bg} rounded-2xl p-1 mb-8`}
                >
                  <div className="bg-white rounded-xl p-8">
                    <div className="flex items-start space-x-6">
                      <div
                        className={`${resultStyle.icon} p-3 rounded-xl ${resultStyle.cardBg}`}
                      >
                        {getResultIcon(result.prediction)}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-2xl font-bold ${resultStyle.title} mb-3`}
                        >
                          {getResultMessage(result.prediction).title}
                        </h3>
                        <p
                          className={`${resultStyle.text} text-lg leading-relaxed`}
                        >
                          {getResultMessage(result.prediction).description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`w-3 h-3 ${resultStyle.accent} rounded-full`}
                      ></div>
                      <h4 className="text-lg font-bold text-slate-800">
                        Analysis Result
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-2">
                      {result.prediction || "Complete"}
                    </p>
                    <p className="text-slate-600">Based on content patterns</p>
                  </div>

                  {result.confidence && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-slate-600" />
                        <h4 className="text-lg font-bold text-slate-800">
                          Confidence Score
                        </h4>
                      </div>
                      <div className="flex items-end space-x-4 mb-3">
                        <span className="text-3xl font-bold text-slate-900">
                          {Math.round(result.confidence * 100)}%
                        </span>
                        <span className="text-slate-600 pb-1">accuracy</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${resultStyle.accent} transition-all duration-1500 ease-out rounded-full`}
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="w-6 h-6 text-slate-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">
                        Important Disclaimer
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        This AI tool provides analysis based on content patterns
                        and should be used as a starting point for verification.
                        Always cross-reference information with multiple
                        reputable news sources, fact-checking organizations, and
                        official statements before drawing conclusions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-slate-500 text-sm">
            <Shield className="w-4 h-4" />
            <span>Powered by advanced machine learning</span>
            <span>•</span>
            <span>Always verify with trusted sources</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeNewsDetector;
