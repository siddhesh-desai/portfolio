(function () {
  "use strict";

  var SECTIONS = PORTFOLIO_DATA.neuralNet.sections;
  var OUTPUT_SIZE = SECTIONS.length;
  var OUTPUT_LABELS = ["About", "Experience", "Projects", "Achievements"];

  var INPUT_CATEGORIES = [
    { id: "lang", label: "Languages", keywords: ["python", "javascript", "sql", "c++", "java", "typescript", "go", "rust", "c#"] },
    { id: "aiml", label: "AI / ML", keywords: ["llm", "rag", "langchain", "langgraph", "nlp", "ml", "machine", "learning", "rlhf", "dpo", "sft", "fine-tune", "tensorflow", "pytorch", "llms", "generative"] },
    { id: "data", label: "Data Eng", keywords: ["data", "pipeline", "etl", "elt", "pyspark", "spark", "airflow", "glue", "athena", "redshift", "snowflake", "synthetic"] },
    { id: "cloud", label: "Cloud", keywords: ["aws", "docker", "s3", "ec2", "lambda", "bedrock", "sagemaker", "ecs", "ecr", "keycloak", "superset", "ci/cd", "github"] },
    { id: "fw", label: "Frameworks", keywords: ["fastapi", "react", "django", "flask", "streamlit", "mcp", "agent", "multi-agent", "microservices"] },
    { id: "co", label: "Companies", keywords: [] },
    { id: "proj", label: "Projects", keywords: [] },
    { id: "db", label: "Databases", keywords: ["postgresql", "mongodb", "pinecone", "qdrant", "mysql", "redis"] },
    { id: "sec", label: "Sections", keywords: ["about", "experience", "achievements", "skill", "skills", "contact", "resume", "projects", "project"] },
  ];

  var INPUT_SIZE = INPUT_CATEGORIES.length;
  var HIDDEN_SIZE = 6;
  var LAYER_SIZES = [INPUT_SIZE, HIDDEN_SIZE, OUTPUT_SIZE];

  var KEYWORD_MAP = {};

  var canvas, ctx;
  var hintEl, inputEl;
  var cssWidth = 380;
  var cssHeight = 240;
  var animationFrame = null;
  var currentActivations = null;
  var animPhase = 0;
  var animStartTime = 0;
  var ANIM_DURATION = 900;

  var NODE_RADIUS = 7;
  var ACCENT = { r: 56, g: 189, b: 248 };
  var MUTED = { r: 100, g: 116, b: 139 };

  var STOP_WORDS = {
    "the":1,"a":1,"an":1,"and":1,"or":1,"but":1,"in":1,"on":1,"at":1,"to":1,
    "for":1,"of":1,"with":1,"by":1,"from":1,"is":1,"was":1,"are":1,"were":1,
    "be":1,"been":1,"being":1,"have":1,"has":1,"had":1,"do":1,"does":1,"did":1,
    "will":1,"would":1,"could":1,"should":1,"may":1,"might":1,"shall":1,"can":1,
    "that":1,"this":1,"these":1,"those":1,"i":1,"me":1,"my":1,"we":1,"our":1,
    "you":1,"your":1,"he":1,"him":1,"his":1,"she":1,"her":1,"it":1,"its":1,
    "they":1,"them":1,"their":1,"what":1,"which":1,"who":1,"whom":1,"when":1,
    "where":1,"why":1,"how":1,"all":1,"each":1,"every":1,"both":1,"few":1,
    "more":1,"most":1,"other":1,"some":1,"such":1,"no":1,"nor":1,"not":1,
    "only":1,"own":1,"same":1,"so":1,"than":1,"too":1,"very":1,"just":1,
    "because":1,"as":1,"until":1,"while":1,"if":1,"then":1,"also":1,"into":1,
    "through":1,"during":1,"before":1,"after":1,"above":1,"below":1,"between":1,
    "under":1,"over":1,"up":1,"down":1,"out":1,"off":1,"again":1,"further":1,
    "once":1,"here":1,"there":1,"am":1,"i'm":1,"i've":1,"like":1,"using":1,
    "via":1,"across":1,"including":1,"among":1,"based":1,"end-to-end":1,
    "ve":1,"re":1,"don":1,"t":1
  };

  var EXP_TAG_WEIGHT = 4;
  var TAG_WEIGHT = 3;
  var TITLE_WEIGHT = 2;
  var TEXT_WEIGHT = 1;

  var SECTION_OVERRIDES = {
    "about":        { about: 1.0, experience: 0.1, projects: 0.1, achievements: 0.1 },
    "experience":   { about: 0.1, experience: 1.0, projects: 0.1, achievements: 0.1 },
    "projects":     { about: 0.1, experience: 0.1, projects: 1.0, achievements: 0.1 },
    "project":      { about: 0.1, experience: 0.1, projects: 1.0, achievements: 0.1 },
    "achievements": { about: 0.1, experience: 0.1, projects: 0.1, achievements: 1.0 },
    "skills":       { about: 0.2, experience: 0.3, projects: 0.3, achievements: 0.1 },
    "skill":        { about: 0.2, experience: 0.3, projects: 0.3, achievements: 0.1 },
    "contact":      { about: 0.8, experience: 0.1, projects: 0.1, achievements: 0.1 },
    "resume":       { about: 0.6, experience: 0.5, projects: 0.1, achievements: 0.1 },
  };

  /* ========== Text Processing ========== */

  function stripHtml(str) {
    return str.replace(/<[^>]*>/g, " ");
  }

  function tokenize(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9+#\-\/]/g, " ")
      .split(/\s+/)
      .filter(function (t) {
        if (t.length < 2) return false;
        if (STOP_WORDS[t]) return false;
        if (/^\d+$/.test(t)) return false;
        return true;
      });
  }

  /* ========== Auto-Compute Weights ========== */

  function buildWeights() {
    var DATA = PORTFOLIO_DATA;
    var sectionCounts = {};
    SECTIONS.forEach(function (sec) { sectionCounts[sec] = {}; });

    function addTokens(section, text, weight) {
      if (!text) return;
      tokenize(text).forEach(function (t) {
        sectionCounts[section][t] = (sectionCounts[section][t] || 0) + weight;
      });
    }

    // Scan About
    (DATA.about || []).forEach(function (p) {
      addTokens("about", stripHtml(p), TEXT_WEIGHT);
    });

    // Scan Experience - tags weighted higher (professional skill usage)
    (DATA.experience || []).forEach(function (exp) {
      addTokens("experience", exp.role, TITLE_WEIGHT);
      addTokens("experience", exp.company, TITLE_WEIGHT);
      (exp.bullets || []).forEach(function (b) { addTokens("experience", b, TEXT_WEIGHT); });
      (exp.tags || []).forEach(function (t) { addTokens("experience", t, EXP_TAG_WEIGHT); });
    });

    // Scan Leadership -> grouped under experience
    (DATA.leadership || []).forEach(function (l) {
      addTokens("experience", l.role, TITLE_WEIGHT);
      addTokens("experience", l.org, TEXT_WEIGHT);
      addTokens("experience", l.description, TEXT_WEIGHT);
    });

    // Scan Featured Projects (title, description, tags, badge)
    (DATA.featuredProjects || []).forEach(function (p) {
      addTokens("projects", p.title, TITLE_WEIGHT);
      addTokens("projects", p.description, TEXT_WEIGHT);
      (p.tags || []).forEach(function (t) { addTokens("projects", t, TAG_WEIGHT); });
      if (p.badge) addTokens("projects", p.badge, TEXT_WEIGHT);
    });

    // Scan Archive -> skip entries already in featured projects to avoid double-counting
    var featuredTitles = {};
    (DATA.featuredProjects || []).forEach(function (p) {
      featuredTitles[p.title.toLowerCase()] = true;
    });
    (DATA.archive || []).forEach(function (p) {
      if (featuredTitles[p.title.toLowerCase()]) return;
      addTokens("projects", p.title, TITLE_WEIGHT);
      (p.tags || []).forEach(function (t) { addTokens("projects", t, TAG_WEIGHT); });
      if (p.madeAt) addTokens("projects", p.madeAt, TEXT_WEIGHT);
    });

    // Scan Achievements (title, description)
    (DATA.achievements || []).forEach(function (a) {
      addTokens("achievements", a.title, TITLE_WEIGHT);
      addTokens("achievements", a.description, TEXT_WEIGHT);
    });

    // Collect all unique words
    var allWords = {};
    SECTIONS.forEach(function (sec) {
      Object.keys(sectionCounts[sec]).forEach(function (w) { allWords[w] = true; });
    });

    // Compute IDF: words unique to one section get boosted
    var numSections = SECTIONS.length;
    var wordIDF = {};
    Object.keys(allWords).forEach(function (word) {
      var docFreq = 0;
      SECTIONS.forEach(function (sec) {
        if (sectionCounts[sec][word]) docFreq++;
      });
      wordIDF[word] = Math.log(1 + numSections / docFreq);
    });

    // Build keyword map with TF-IDF scores normalized per word
    var keywordMap = {};
    Object.keys(allWords).forEach(function (word) {
      var scores = {};
      var maxScore = 0;

      SECTIONS.forEach(function (sec) {
        var tf = sectionCounts[sec][word] || 0;
        var tfidf = tf * wordIDF[word];
        scores[sec] = tfidf;
        if (tfidf > maxScore) maxScore = tfidf;
      });

      if (maxScore > 0) {
        SECTIONS.forEach(function (sec) {
          scores[sec] = scores[sec] > 0
            ? Math.round((0.1 + 0.9 * scores[sec] / maxScore) * 100) / 100
            : 0.1;
        });
        keywordMap[word] = scores;
      }
    });

    // Apply manual overrides for section-name keywords
    Object.keys(SECTION_OVERRIDES).forEach(function (word) {
      keywordMap[word] = SECTION_OVERRIDES[word];
    });

    return keywordMap;
  }

  /* ========== Auto-populate Input Categories ========== */

  function populateCategories() {
    var DATA = PORTFOLIO_DATA;
    var companyKeywords = {};
    var projectKeywords = {};

    // Extract company names from experience
    (DATA.experience || []).forEach(function (exp) {
      tokenize(exp.company).forEach(function (t) { companyKeywords[t] = true; });
    });

    // Extract project names from featured projects and archive
    (DATA.featuredProjects || []).forEach(function (p) {
      tokenize(p.title).forEach(function (t) { projectKeywords[t] = true; });
    });
    (DATA.archive || []).forEach(function (p) {
      tokenize(p.title).forEach(function (t) { projectKeywords[t] = true; });
    });

    // Merge into categories (avoid duplicates)
    INPUT_CATEGORIES.forEach(function (cat) {
      if (cat.id === "co") {
        Object.keys(companyKeywords).forEach(function (w) {
          if (cat.keywords.indexOf(w) === -1) cat.keywords.push(w);
        });
      }
      if (cat.id === "proj") {
        Object.keys(projectKeywords).forEach(function (w) {
          if (cat.keywords.indexOf(w) === -1) cat.keywords.push(w);
        });
      }
    });

    // Also add any tags from experience/projects into matching categories
    var tagToCat = {};
    INPUT_CATEGORIES.forEach(function (cat) {
      cat.keywords.forEach(function (kw) { tagToCat[kw] = cat; });
    });

    function addTagToCategory(tag) {
      var t = tag.toLowerCase();
      if (tagToCat[t]) return;
      var tokens = tokenize(tag);
      tokens.forEach(function (tok) {
        if (tagToCat[tok]) return;
        // Try to find a matching category by checking KEYWORD_MAP affinity
        if (KEYWORD_MAP[tok]) {
          var topSec = "experience";
          var topVal = 0;
          SECTIONS.forEach(function (sec) {
            if (KEYWORD_MAP[tok][sec] > topVal) {
              topVal = KEYWORD_MAP[tok][sec];
              topSec = sec;
            }
          });
          var catId = topSec === "projects" ? "proj" : topSec === "achievements" ? "proj" : "fw";
          INPUT_CATEGORIES.forEach(function (cat) {
            if (cat.id === catId && cat.keywords.indexOf(tok) === -1) {
              cat.keywords.push(tok);
              tagToCat[tok] = cat;
            }
          });
        }
      });
    }

    (DATA.experience || []).forEach(function (exp) {
      (exp.tags || []).forEach(addTagToCategory);
    });
    (DATA.featuredProjects || []).forEach(function (p) {
      (p.tags || []).forEach(addTagToCategory);
    });
    (DATA.archive || []).forEach(function (p) {
      (p.tags || []).forEach(addTagToCategory);
    });
  }

  /* ========== Math ========== */

  function softmax(arr) {
    var max = Math.max.apply(null, arr);
    var exps = arr.map(function (v) { return Math.exp(v - max); });
    var sum = exps.reduce(function (a, b) { return a + b; }, 0);
    return exps.map(function (v) { return v / sum; });
  }

  function relu(x) { return Math.max(0, x); }

  /* ========== Forward Pass ========== */

  function forwardPass(queryTokens) {
    var inputActivations = INPUT_CATEGORIES.map(function (cat) {
      var score = 0;
      queryTokens.forEach(function (token) {
        if (cat.keywords.indexOf(token) !== -1) score += 1;
      });
      return Math.min(1.0, score);
    });

    var sectionScores = new Array(OUTPUT_SIZE).fill(0);
    var matchCount = 0;
    queryTokens.forEach(function (token) {
      if (KEYWORD_MAP[token]) {
        matchCount++;
        SECTIONS.forEach(function (sec, i) {
          sectionScores[i] += KEYWORD_MAP[token][sec] || 0;
        });
      }
    });

    var totalInput = inputActivations.reduce(function (a, b) { return a + b; }, 0);

    // No matches in keyword map at all
    if (matchCount === 0) return null;

    // Word found in KEYWORD_MAP but not in any category - give a dim activation to "Sections" node
    if (totalInput === 0 && matchCount > 0) {
      inputActivations[INPUT_SIZE - 1] = 0.5;
    }

    if (matchCount > 0) {
      sectionScores = sectionScores.map(function (s) { return s / matchCount; });
    }

    var hiddenActivations = [];
    for (var h = 0; h < HIDDEN_SIZE; h++) {
      var val = 0;
      inputActivations.forEach(function (inp, i) {
        val += inp * Math.cos((h + 1) * (i + 1) * 0.5) * 0.6;
      });
      sectionScores.forEach(function (s, i) {
        val += s * Math.sin((h + 1) * (i + 1) * 0.8) * 0.4;
      });
      hiddenActivations.push(relu(val));
    }

    var hMax = Math.max.apply(null, hiddenActivations);
    if (hMax > 0) {
      hiddenActivations = hiddenActivations.map(function (v) { return v / hMax; });
    }

    var outputProbs = softmax(sectionScores);

    return {
      input: inputActivations,
      hidden: hiddenActivations,
      output: outputProbs,
    };
  }

  /* ========== Node Positions ========== */

  function getNodePositions(w, h) {
    var positions = [];
    var leftPad = 72;
    var rightPad = 110;
    var topPad = 20;
    var bottomPad = 20;
    var usableW = w - leftPad - rightPad;
    var usableH = h - topPad - bottomPad;
    var layerSpacing = usableW / (LAYER_SIZES.length - 1);

    LAYER_SIZES.forEach(function (count, layerIdx) {
      var x = leftPad + layerIdx * layerSpacing;
      var nodeSpacing = usableH / (count + 1);
      var layer = [];
      for (var n = 0; n < count; n++) {
        layer.push({ x: x, y: topPad + nodeSpacing * (n + 1) });
      }
      positions.push(layer);
    });

    return positions;
  }

  /* ========== Drawing ========== */

  function drawNetwork(activations, phase) {
    if (!ctx) return;
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    var positions = getNodePositions(cssWidth, cssHeight);

    for (var l = 0; l < positions.length - 1; l++) {
      var fromLayer = positions[l];
      var toLayer = positions[l + 1];

      fromLayer.forEach(function (from, fi) {
        toLayer.forEach(function (to, ti) {
          var alpha = 0.05;

          if (activations) {
            var srcVals = l === 0 ? activations.input : activations.hidden;
            var dstVals = l === 0 ? activations.hidden : activations.output;
            var srcVal = fi < srcVals.length ? srcVals[fi] : 0;
            var dstVal = ti < dstVals.length ? dstVals[ti] : 0;
            var layerPhase = l / (LAYER_SIZES.length - 1);

            if (phase > layerPhase && srcVal > 0.1) {
              var strength = srcVal * dstVal;
              alpha = 0.05 + strength * 0.35;
            }
          }

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);

          if (activations && alpha > 0.1) {
            ctx.strokeStyle = "rgba(" + ACCENT.r + "," + ACCENT.g + "," + ACCENT.b + "," + alpha + ")";
          } else {
            ctx.strokeStyle = "rgba(" + MUTED.r + "," + MUTED.g + "," + MUTED.b + "," + alpha + ")";
          }
          ctx.lineWidth = alpha > 0.15 ? 1.5 : 0.5;
          ctx.stroke();
        });
      });
    }

    positions.forEach(function (layer, layerIdx) {
      layer.forEach(function (pos, nodeIdx) {
        var activation = 0;
        var isActive = false;

        if (activations) {
          var vals;
          if (layerIdx === 0) vals = activations.input;
          else if (layerIdx === 1) vals = activations.hidden;
          else vals = activations.output;

          if (nodeIdx < vals.length) activation = vals[nodeIdx];

          var layerPhase = layerIdx / (LAYER_SIZES.length - 1);
          isActive = phase > layerPhase;
        }

        var r = NODE_RADIUS;
        var color;

        if (isActive && activation > 0.15) {
          var a = Math.min(1, 0.4 + activation * 0.6);
          color = "rgba(" + ACCENT.r + "," + ACCENT.g + "," + ACCENT.b + "," + a + ")";
          if (activation > 0.4) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r + 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + ACCENT.r + "," + ACCENT.g + "," + ACCENT.b + "," + (activation * 0.15) + ")";
            ctx.fill();
          }
        } else {
          color = "rgba(" + MUTED.r + "," + MUTED.g + "," + MUTED.b + "," + (0.15 + activation * 0.2) + ")";
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (layerIdx === 0 && nodeIdx < INPUT_CATEGORIES.length) {
          var label = INPUT_CATEGORIES[nodeIdx].label;
          ctx.font = "10px 'Inter', sans-serif";
          ctx.textAlign = "right";
          ctx.fillStyle = isActive && activation > 0.15
            ? "rgba(" + ACCENT.r + "," + ACCENT.g + "," + ACCENT.b + ",0.9)"
            : "rgba(" + MUTED.r + "," + MUTED.g + "," + MUTED.b + ",0.45)";
          ctx.fillText(label, pos.x - r - 6, pos.y + 4);
        }

        if (layerIdx === positions.length - 1 && nodeIdx < OUTPUT_LABELS.length) {
          var pct = activations && isActive ? Math.round(activations.output[nodeIdx] * 100) : 0;
          var outLabel = OUTPUT_LABELS[nodeIdx];

          ctx.font = "11px 'Inter', sans-serif";
          ctx.textAlign = "left";

          if (isActive && activation > 0.2) {
            ctx.fillStyle = "rgba(" + ACCENT.r + "," + ACCENT.g + "," + ACCENT.b + ",0.9)";
            ctx.fillText(outLabel + "  " + pct + "%", pos.x + r + 8, pos.y + 4);
          } else {
            ctx.fillStyle = "rgba(" + MUTED.r + "," + MUTED.g + "," + MUTED.b + ",0.45)";
            ctx.fillText(outLabel, pos.x + r + 8, pos.y + 4);
          }
        }
      });
    });
  }

  /* ========== Animation ========== */

  function animate(timestamp) {
    if (!animStartTime) animStartTime = timestamp;
    var elapsed = timestamp - animStartTime;
    animPhase = Math.min(1, elapsed / ANIM_DURATION);

    drawNetwork(currentActivations, animPhase);

    if (animPhase < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animationFrame = null;
      handleResult();
    }
  }

  function startAnimation(activations) {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    currentActivations = activations;
    animStartTime = 0;
    animPhase = 0;
    canvas.classList.add("active");
    animationFrame = requestAnimationFrame(animate);
  }

  /* ========== Results ========== */

  function handleResult() {
    if (!currentActivations) return;

    var probs = currentActivations.output;
    var maxIdx = 0;
    probs.forEach(function (v, i) {
      if (v > probs[maxIdx]) maxIdx = i;
    });

    var targetSection = SECTIONS[maxIdx];
    var confidence = Math.round(probs[maxIdx] * 100);

    hintEl.innerHTML = 'Best match: <span class="result">' + OUTPUT_LABELS[maxIdx] + "</span>  ·  " + confidence + "% confidence";

    var sectionEl = document.getElementById(targetSection);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    highlightMatches(inputEl.value.toLowerCase().trim());
  }

  function highlightMatches(query) {
    document.querySelectorAll(".highlight-match").forEach(function (el) {
      el.classList.remove("highlight-match");
    });

    var tokens = query.split(/\s+/);
    document.querySelectorAll("[data-keywords]").forEach(function (item) {
      var keywords = item.dataset.keywords || "";
      var matched = tokens.some(function (t) {
        return t.length > 1 && keywords.indexOf(t) !== -1;
      });
      if (matched) item.classList.add("highlight-match");
    });
  }

  /* ========== Input ========== */

  function handleQuery() {
    var raw = inputEl.value.toLowerCase().trim();
    if (!raw) { resetNetwork(); return; }

    var tokens = raw.split(/\s+/).filter(function (t) { return t.length > 0; });
    var result = forwardPass(tokens);

    if (!result) {
      hintEl.textContent = "No match - try: Python, LLM, AWS, experience, hackathon...";
      canvas.classList.remove("active");
      drawNetwork(null, 0);
      document.querySelectorAll(".highlight-match").forEach(function (el) {
        el.classList.remove("highlight-match");
      });
      return;
    }

    startAnimation(result);
  }

  function resetNetwork() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    currentActivations = null;
    canvas.classList.remove("active");
    hintEl.textContent = "";
    drawNetwork(null, 0);
    document.querySelectorAll(".highlight-match").forEach(function (el) {
      el.classList.remove("highlight-match");
    });
  }

  /* ========== Init ========== */

  function init() {
    canvas = document.getElementById("nn-canvas");
    hintEl = document.getElementById("nn-hint");
    inputEl = document.getElementById("nn-input");
    if (!canvas || !inputEl || !hintEl) return;

    // Auto-compute weights from portfolio content
    KEYWORD_MAP = buildWeights();
    populateCategories();

    ctx = canvas.getContext("2d");

    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    cssWidth = rect.width;
    cssHeight = rect.height;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    ctx.scale(dpr, dpr);

    drawNetwork(null, 0);

    var debounceTimer;
    inputEl.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleQuery, 300);
    });

    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        clearTimeout(debounceTimer);
        handleQuery();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
