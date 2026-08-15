// ===== PROJECT DATA =====
const projects = [
    {
    id: 8,
    title: 'Chara Chatbot – Tsundere Waifu with NLP',
    tech: 'Python · Flask · scikit-learn · Sastrawi · HTML/CSS/JS',
    desc: 'Interactive chatbot with a tsundere personality, using intent classification and mood-based responses.',
    fullDesc: `
        <h3>Overview</h3>
        <p>
            This project is a <strong>full-stack conversational chatbot</strong> featuring 
            <strong>Chara</strong> from Undertale as a tsundere waifu. Built with a 
            <strong>Flask</strong> backend and a responsive HTML/CSS/JS frontend, 
            the chatbot uses <strong>classical NLP</strong> (intent classification with 
            TF‑IDF and Naïve Bayes) to understand user messages and respond with a 
            consistent, emotionally reactive personality. The system tracks mood, 
            conversation history, and adapts its responses accordingly.
        </p>

        <h3>System Architecture</h3>
        <pre style="background:#1a2330;padding:12px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
┌──────────────────────────────────────────────────────┐
│                     Frontend (Browser)               │
│  ┌─────────────┐    ┌─────────────────────────────┐ │
│  │  index.html  │◄───│  style.css + script.js      │ │
│  └─────────────┘    └─────────────────────────────┘ │
│         │                                            │
│         ▼ (fetch /chat POST)                        │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│                  Flask Backend (app.py)              │
│  ┌─────────────────────────────────────────────────┐ │
│  │  /chat endpoint → preprocess → predict intent  │ │
│  │         ↓                                      │ │
│  │  update_mood() → update_chat_state()           │ │
│  │         ↓                                      │ │
│  │  select response based on mood + intent        │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│                      Data Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  intents.json│  │  model.pkl   │  │ chat_state│ │
│  │  (patterns & │  │  (TF-IDF +   │  │ .json     │ │
│  │   responses) │  │   NB model)  │  │ (memory)  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└──────────────────────────────────────────────────────┘
        </pre>

        <h3>NLP Pipeline – Intent Classification</h3>
        <p>
            The chatbot uses a classic <strong>machine learning pipeline</strong> for 
            understanding user input:
        </p>
        <ol>
            <li>
                <strong>Preprocessing (<code>utils.preprocess()</code>):</strong>
                <ul>
                    <li>Lowercasing</li>
                    <li>Punctuation removal</li>
                    <li>Stopword removal (Indonesian stopwords: "yang", "dan", "di", "ke", "dari", "itu", "ini", "aku", "kamu")</li>
                    <li><strong>Stemming</strong> using <strong>Sastrawi</strong> (Indonesian stemmer)</li>
                </ul>
            </li>
            <li>
                <strong>Feature Extraction:</strong>
                \\[ \\text{TF-IDF}(t,d) = \\text{TF}(t,d) \\times \\log\\left(\\frac{N}{\\text{DF}(t)}\\right) \\]
                <p>
                    Converts text into a numerical feature vector using <strong>Term 
                    Frequency-Inverse Document Frequency</strong> from scikit-learn.
                </p>
            </li>
            <li>
                <strong>Classifier:</strong>
                \\[ P(y \\mid x) = \\frac{P(y) \\prod_{i=1}^{n} P(x_i \\mid y)}{P(x)} \\]
                <p>
                    A <strong>Multinomial Naïve Bayes</strong> classifier trained on 
                    labeled intent patterns. The model predicts the most likely 
                    intent tag for the user's message.
                </p>
            </li>
        </ol>

        <h3>Intent Definitions (<code>intents.json</code>)</h3>
        <p>
            The chatbot understands 9 distinct intents, each with multiple patterns 
            and responses:
        </p>
        <ul>
            <li><strong>sapaan</strong> – Greetings: "hai", "halo", "pagi", "howdy"</li>
            <li><strong>kangen</strong> – Missing Chara: "aku kangen kamu", "kangen chara"</li>
            <li><strong>marah</strong> – Anger: "kamu nyebelin", "aku benci kamu"</li>
            <li><strong>sayang</strong> – Love: "aku sayang kamu", "aku cinta kamu"</li>
            <li><strong>bye</strong> – Farewell: "bye", "dadah", "selamat tinggal"</li>
            <li><strong>terima kasih</strong> – Thanks: "terima kasih", "makasih"</li>
            <li><strong>bantu</strong> – Help: "bantu aku", "tolong"</li>
            <li><strong>lainnya</strong> – Other: "apa kabar", "bagaimana harimu"</li>
            <li><strong>pujian</strong> – Compliments: "kamu imut", "kamu cantik"</li>
        </ul>
        <p>
            Each intent contains multiple response variations to make the chatbot 
            feel more natural and unpredictable.
        </p>

        <h3>Mood System & Context Memory</h3>
        <p>
            The chatbot maintains a persistent <strong>mood state</strong> that 
            influences its response style:
        </p>
        <ul>
            <li><strong>Mood tracking:</strong> The <code>update_mood()</code> function 
            scans the user's message for emotional keywords. Positive words 
            ("sayang", "kangen", "manis", "baik") increase the mood score, while 
            negative words ("bodoh", "jelek", "kesal", "benci") decrease it.</li>
            <li><strong>Mood range:</strong> Score is clamped between -5 (very upset) 
            and +5 (very happy).</li>
            <li><strong>Response selection:</strong>
                <ul>
                    <li><strong>Mood ≤ -1:</strong> Selects the first (harsh) response</li>
                    <li><strong>Mood ≥ 1:</strong> Selects the last (sweet) response</li>
                    <li><strong>Neutral:</strong> Random response</li>
                </ul>
            </li>
            <li><strong>Conversation memory:</strong> The system stores:
                <ul>
                    <li>Last intent</li>
                    <li>Current emotion</li>
                    <li>Full conversation history (user & bot messages)</li>
                    <li>Last user message and bot response</li>
                </ul>
            </li>
        </ul>

        <h3>State Persistence</h3>
        <p>
            All conversational state is saved to <code>chat_state.json</code>, 
            allowing the chatbot to remember the conversation across sessions. 
            This includes the mood score, intent history, and message logs.
        </p>

        <h3>Training Pipeline (<code>train.py</code>)</h3>
        <p>
            The model is trained offline using:
        </p>
        <ul>
            <li><strong>Data:</strong> Patterns from <code>intents.json</code> (preprocessed)</li>
            <li><strong>Vectorizer:</strong> TF-IDF with default parameters</li>
            <li><strong>Classifier:</strong> Multinomial Naïve Bayes</li>
            <li><strong>Output:</strong> <code>model.pkl</code> (pickled pipeline)</li>
            <li><strong>Accuracy:</strong> Near-perfect on training data (validated with <code>accuracy_score</code>)</li>
        </ul>

        <h3>API Endpoint</h3>
        <p>
            <code>POST /chat</code> – Accepts JSON with a <code>message</code> field.
            Returns a JSON response containing the chatbot's reply.
            The endpoint handles:
        </p>
        <ul>
            <li>Preprocessing the user input</li>
            <li>Predicting the intent using the trained model</li>
            <li>Selecting an appropriate response based on intent and mood</li>
            <li>Updating the mood score and conversation state</li>
            <li>Storing the updated state to <code>chat_state.json</code></li>
        </ul>

        <h3>Frontend UI (<code>index.html</code> + <code>style.css</code> + <code>script.js</code>)</h3>
        <p>
            The user interface is designed to mimic a messaging app with a dark theme:
        </p>
        <ul>
            <li><strong>Chat header:</strong> Displays Chara's avatar and name</li>
            <li><strong>Message bubbles:</strong> User messages (blue, right-aligned) and 
            Chara's messages (grey, left-aligned with avatar)</li>
            <li><strong>Typing indicator:</strong> Shows "Chara sedang mengetik..." 
            while the server is processing (1-second simulated delay)</li>
            <li><strong>Responsive design:</strong> Works on both desktop and mobile</li>
            <li><strong>CSS gradient background:</strong> Deep blue gradient matching 
            the Undertale aesthetic</li>
        </ul>

        <h3>Key Dependencies (<code>requirements.txt</code>)</h3>
        <ul>
            <li><strong>Flask 3.0.0</strong> – Web framework</li>
            <li><strong>scikit-learn 1.4.2</strong> – TF-IDF vectorizer & Naïve Bayes</li>
            <li><strong>numpy 1.26.4</strong> – Numerical operations</li>
            <li><strong>pandas 2.2.1</strong> – Data handling (optional)</li>
            <li><strong>joblib 1.4.2</strong> – Model persistence</li>
            <li><strong>Sastrawi</strong> – Indonesian stemmer (installed separately)</li>
        </ul>

        <h3>Project Structure</h3>
        <pre style="background:#1a2330;padding:12px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
chara-chatbot/
├── app.py              # Flask server & main logic
├── train.py            # Training script
├── utils.py            # Preprocessing, mood, state management
├── intents.json        # Intent definitions (patterns + responses)
├── model.pkl           # Trained TF-IDF + Naïve Bayes model
├── chat_state.json     # Persistent conversation memory
├── requirements.txt    # Python dependencies
├── README.md           # Setup instructions
└── templates/
    └── index.html      # Frontend HTML
└── static/
    ├── style.css       # UI styling
    ├── script.js       # Frontend JavaScript (fetch API)
    └── image/
        └── chara.jpg   # Avatar image
        </pre>

        <h3>Example Conversation</h3>
        <pre style="background:#1a2330;padding:12px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
User:   howdy
Chara:  Hmph, siapa suruh nyapa duluan?!

User:   aku sayang kamu
Chara:  Y-ya... aku juga... mungkin... eh! Lupa!

User:   kamu kok tambah imut si?
Chara:  kamu baru bilang itu karena aku baik sama kamu.

User:   bye
Chara:  Jangan lama-lama... aku nunggu.
        </pre>

        <h3>Key Features Summary</h3>
        <ul>
            <li><strong>Intent classification:</strong> 9 intents with TF‑IDF + Naïve Bayes</li>
            <li><strong>Mood tracking:</strong> Dynamic mood score affecting response style</li>
            <li><strong>Persistent memory:</strong> Conversation history and state saved to JSON</li>
            <li><strong>Indonesian NLP:</strong> Stemming and stopword removal using Sastrawi</li>
            <li><strong>Tsundere personality:</strong> Responses range from harsh to sweet based on mood</li>
            <li><strong>Full-stack:</strong> Flask backend + interactive frontend</li>
            <li><strong>Real-time chat UI:</strong> Messaging app style with typing indicator</li>
        </ul>

        <h3>Future Improvements</h3>
        <ul>
            <li>Add <strong>sequence-to-sequence</strong> model (LSTM/Transformer) for more natural conversations</li>
            <li>Integrate <strong>sentiment analysis</strong> for more accurate mood detection</li>
            <li>Add <strong>voice input/output</strong> for a more immersive experience</li>
            <li>Deploy to cloud (Heroku, Railway, or Vercel) for public access</li>
            <li>Add <strong>multi-language support</strong> (English, Japanese, etc.)</li>
        </ul>
        <h3>Chat Interface Screenshot</h3>
        <p>Here’s a real screenshot of the chatbot interface:</p>
        <img src="image/Screenshot from 2026-08-15 14-37-10.png" 
             alt="Chara Chatbot Interface" 
             style="width:100%; max-width:700px; border-radius:12px; border:1px solid #2a3340; margin:12px 0;" />
        <p><em>Make sure the image file exists at the specified path.</em></p>
    `,
    github: 'https://github.com/Daniel-dev287/Chara_bot-NLP-ChatBot-',
    icon: 'fas fa-robot'
    },
    {
        id: 2,
        title: 'CNN – Plant Disease Detection',
        tech: 'PyTorch · ResNet18 · Transfer Learning',
        desc: 'Classifies 15 plant leaf diseases using a CNN with transfer learning.',
        fullDesc: `
        <h3>Dataset & Classes</h3>
        <p>
            The model is trained on the <strong>PlantVillage</strong> dataset, which contains over 38,000 images of plant leaves across 15 classes, including healthy leaves and various diseases such as Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, and Mosaic Virus. Each image is a 256×256 RGB photo.
        </p>

        <h3>Data Preprocessing & Augmentation</h3>
        <p>
            To improve generalisation and prevent overfitting, the following augmentations are applied randomly during training:
        </p>
        <ul>
            <li>Resize to 256×256, then Random Crop to 224×224</li>
            <li>Random Horizontal Flip (p=0.5) and Vertical Flip (p=0.2)</li>
            <li>Random Rotation up to 20°</li>
            <li>Color Jitter (brightness, contrast, saturation, hue)</li>
            <li>Random Affine (translation, scale)</li>
            <li>Normalization with ImageNet mean and std</li>
        </ul>

        <h3>Model Architecture – Modified ResNet18</h3>
        <p>
            We use a <strong>ResNet18</strong> pretrained on ImageNet as the backbone. The early layers (first 30 layers) are <strong>frozen</strong> to preserve general features, while the remaining layers are fine‑tuned. The final fully‑connected layer is replaced with a custom sequential block:
        </p>
        <pre style="background:#1a2330;padding:16px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
ResNet18 (modified)
├── Conv1 (7×7, 64) + BatchNorm + ReLU + MaxPool
├── Layer1: 2 × BasicBlock (64 channels)
├── Layer2: 2 × BasicBlock (128 channels)
├── Layer3: 2 × BasicBlock (256 channels)
├── Layer4: 2 × BasicBlock (512 channels)
├── AdaptiveAvgPool (1×1)
├── Dropout (p=0.5)
├── Linear (512 → 256)
├── ReLU
├── Dropout (p=0.3)
└── Linear (256 → 15 classes)
        </pre>
        <p>
            The dropout layers help reduce overfitting, and the reduced dimensionality (512→256) improves efficiency.
        </p>

        <h3>Training Configuration</h3>
        <ul>
            <li><strong>Loss Function:</strong> Cross‑Entropy Loss (see formula below)</li>
            <li><strong>Optimizer:</strong> Adam with learning rate 0.001 and weight decay 1e-4</li>
            <li><strong>Batch Size:</strong> 32</li>
            <li><strong>Epochs:</strong> 7</li>
            <li><strong>Train/Val Split:</strong> 80/20</li>
        </ul>

        <h3>Training Loop & Evaluation</h3>
        <p>
            During each epoch, the model is trained on the training set and then evaluated on the validation set. The loss and accuracy are recorded and plotted after training. The final model achieves a validation accuracy of around 95% (depending on random seed). The training and validation loss curves show convergence without significant overfitting.
        </p>

        <h3>Key Formulas</h3>
        <p>
            The <strong>Cross‑Entropy Loss</strong> used for multi‑class classification:
        </p>
        \\[ L = -\\sum_{c=1}^{M} y_{o,c} \\log(p_{o,c}) \\]
        <p>
            And the <strong>2D Convolution</strong> operation performed by each convolutional layer:
        </p>
        \\[ y(i,j) = (X * W)(i,j) + b = \\sum_{u} \\sum_{v} X(i+u, j+v) W(u,v) + b \\]

        <h3>How to Use the Model</h3>
        <p>
            After training, the model weights are saved as <code>model.pth</code>. To classify a new leaf image, you can load the model, apply the same preprocessing (resize, normalize), and run inference. The output is the predicted class label (mapped to a human‑readable name via the <code>label_map</code> dictionary).
        </p>
        `,
        github: 'https://github.com/Daniel-dev287/CNN---deteksi-penyakit-tumbuhan',
        icon: 'fas fa-leaf'
    },
    {
        id: 3,
        title: 'Quantum – Hydrogen Atom Simulation',
        tech: 'Python · NumPy · SciPy · Matplotlib',
        desc: 'Numerical simulation of hydrogen atom wavefunctions and probability densities.',
        fullDesc: `
            <h3>Overview</h3>
            <p>
                This project implements a <strong>quantum mechanical simulation</strong> of the hydrogen atom 
                using <strong>atomic units (a.u.)</strong>. It calculates the wavefunction <em>ψ<sub>nlm</sub></em>, 
                energy levels, radial probability distributions, and 2D density slices. The code is modular, 
                with separate files for grid generation, wavefunction calculations, and visualization.
            </p>

            <h3>Physical Background</h3>
            <p>
                The hydrogen atom is described by the <strong>Schrödinger equation</strong> in spherical coordinates:
            </p>
            \\[ -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V(r)\\psi = E\\psi \\]
            <p>
                In atomic units (where <em>ħ = m = e = 1</em>), the potential is <em>V(r) = −1/r</em>, and the 
                energy eigenvalues depend only on the principal quantum number <em>n</em>:
            </p>
            \\[ E_n = -\\frac{1}{2n^2} \\text{ Hartree} \\]
            <p>
                The wavefunction separates into radial and angular parts:
            </p>
            \\[ \\psi_{nlm}(r,\\theta,\\phi) = R_{nl}(r) \\cdot Y_{lm}(\\theta,\\phi) \\]
            <ul>
                <li><strong>n</strong> – principal quantum number (1, 2, 3, ...)</li>
                <li><strong>l</strong> – angular momentum quantum number (0 ≤ l ≤ n−1)</li>
                <li><strong>m</strong> – magnetic quantum number (−l ≤ m ≤ l)</li>
            </ul>

            <h3>Radial Wavefunction</h3>
            <p>
                The radial part <em>R<sub>nl</sub>(r)</em> is calculated using the associated Laguerre polynomials:
            </p>
            \\[ R_{nl}(r) = \\sqrt{\\left(\\frac{2}{n}\\right)^3 \\frac{(n-l-1)!}{2n(n+l)!}} \\; e^{-\\rho/2} \\rho^{l} \\, L_{n-l-1}^{2l+1}(\\rho) \\]
            <p>
                where <em>ρ = 2r/n</em>. The code uses <code>scipy.special.genlaguerre</code> to evaluate the 
                generalized Laguerre polynomials efficiently.
            </p>

            <h3>Angular Wavefunction – Spherical Harmonics</h3>
            <p>
                The angular part <em>Y<sub>lm</sub>(θ, φ)</em> is computed using <code>scipy.special.sph_harm</code>:
            </p>
            \\[ Y_{lm}(\\theta,\\phi) = \\sqrt{\\frac{2l+1}{4\\pi}\\frac{(l-m)!}{(l+m)!}} \\, P_l^m(\\cos\\theta) \\, e^{im\\phi} \\]
            <p>
                where <em>P<sub>l</sub><sup>m</sup></em> are the associated Legendre polynomials.
            </p>

            <h3>Full Wavefunction</h3>
            <p>
                The complete wavefunction is obtained by multiplying the radial and angular parts:
            </p>
            \\[ \\psi_{nlm}(x,y,z) = R_{nl}(r) \\cdot Y_{lm}(\\theta,\\phi) \\]
            <p>
                The code converts Cartesian coordinates to spherical coordinates (<em>r, θ, φ</em>) and then 
                evaluates the wavefunction at each grid point.
            </p>

            <h3>Radial Probability Distribution</h3>
            <p>
                The radial probability density is defined as:
            </p>
            \\[ P_{nl}(r) = r^2 |R_{nl}(r)|^2 \\]
            <p>
                This quantity represents the probability of finding the electron at a distance <em>r</em> from 
                the nucleus, integrated over all angles. The code plots <em>P<sub>nl</sub>(r)</em> for given 
                <em>n</em> and <em>l</em> values.
            </p>

            <h3>2D Density Slices</h3>
            <p>
                The code also generates <strong>2D slices</strong> of the probability density <em>|ψ|²</em> 
                through a plane (xy, xz, or yz). For a given plane (e.g., <em>z = 0</em>), it computes:
            </p>
            \\[ \\rho(x,y) = |\\psi_{nlm}(x,y,z_0)|^2 \\]
            <p>
                This produces a color map showing the electron cloud distribution in that plane. The 
                visualization helps understand the shape and orientation of atomic orbitals.
            </p>

            <h3>Code Structure</h3>
            <ul>
                <li><strong><code>hydrogen.py</code></strong> – Core physics functions: <code>energy_n</code>, <code>radial_wavefunction</code>, <code>spherical_harmonic</code>, <code>psi_nlm</code>, <code>radial_probability</code>.</li>
                <li><strong><code>grid.py</code></strong> – Creates radial grids (<code>radial_grid</code>) and Cartesian grids (<code>cartesian_grid</code>) for plotting.</li>
                <li><strong><code>visualize.py</code></strong> – Plotting functions: <code>plot_radial</code> (radial probability) and <code>plot_density_slice</code> (2D density slice).</li>
                <li><strong><code>cli.py</code></strong> – Command-line interface with arguments for quantum numbers, grid parameters, and output options. Includes a <code>--demo</code> flag to generate a set of sample plots.</li>
                <li><strong><code>__init__.py</code></strong> – Makes the directory a Python package.</li>
            </ul>

            <h3>CLI Usage Examples</h3>
            <pre style="background:#1a2330;padding:12px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
# Generate demo plots (radial for n=1,l=0; n=2,l=0; n=2,l=1; slice for n=3,l=2,m=0)
python -m hydrogen_atom.cli --demo

# Plot radial probability for n=3, l=1
python -m hydrogen_atom.cli --n 3 --l 1 --plot-radial

# Plot density slice in xy-plane (z=0) for n=3, l=2, m=0
python -m hydrogen_atom.cli --n 3 --l 2 --m 0 --plot-slice --plane z --plane-value 0

# Custom grid resolution
python -m hydrogen_atom.cli --n 4 --l 2 --plot-radial --rmax 60 --nr 3000
            </pre>

            <h3>Example Outputs</h3>
            <p>
                The <strong>radial probability plots</strong> show peaks at the most probable electron-nucleus 
                distances. For <em>n=1, l=0</em> (1s orbital), the peak is at <em>r = 1 a.u.</em> (Bohr radius). 
                For <em>n=2, l=0</em> (2s), there are two peaks (one inner, one outer). For <em>n=2, l=1</em> (2p), 
                the peak is at a larger radius and the probability is zero at the origin.
            </p>
            <p>
                The <strong>density slice plots</strong> (e.g., <em>n=3, l=2, m=0</em>) show the characteristic 
                angular distribution of the orbital. For <em>m=0</em>, the distribution is symmetric around the 
                z‑axis, while <em>|m|>0</em> produces lobes with angular momentum.
            </p>

            <h3>Key Formulas (Summary)</h3>
            <ul>
                <li>Energy: \( E_n = -0.5 / n^2 \) Hartree</li>
                <li>Radial wavefunction: \( R_{nl}(r) \) using Laguerre polynomials</li>
                <li>Spherical harmonics: \( Y_{lm}(\theta,\phi) \)</li>
                <li>Full wavefunction: \( \psi_{nlm}(x,y,z) = R_{nl}(r) Y_{lm}(\theta,\phi) \)</li>
                <li>Radial probability: \( P_{nl}(r) = r^2 |R_{nl}(r)|^2 \)</li>
                <li>Density slice: \( \rho(x,y) = |\psi_{nlm}(x,y,z_0)|^2 \)</li>
            </ul>

            <h3>Visualization Examples</h3>
            <p>
                The demo generates the following four plots:
            </p>
            <ol>
                <li><strong>Radial probability for n=1, l=0</strong> – a single peak at r ≈ 1 a.u.</li>
                <li><strong>Radial probability for n=2, l=0</strong> – two peaks (inner and outer nodes).</li>
                <li><strong>Radial probability for n=2, l=1</strong> – peak at larger radius, zero at origin.</li>
                <li><strong>Density slice for n=3, l=2, m=0</strong> – a cloverleaf pattern in the xy-plane.</li>
            </ol>
            <p>
                All plots are saved to the <code>outputs/</code> directory with high resolution (150 dpi).
            </p>
            <h3>Sample Output</h3>
            <img src="image/radial_n1_l0.png" alt="Hydrogen atom visualization" style="width:100%; max-width:800px; border-radius:12px; border:1px solid #2a3340; margin-bottom:10px;" />
            <img src="image/radial_n2_l0.png" alt="Hydrogen atom visualization" style="width:100%; max-width:800px; border-radius:12px; border:1px solid #2a3340; margin-bottom:10px;" />
            <img src="image/radial_n2_l1.png" alt="Hydrogen atom visualization" style="width:100%; max-width:800px; border-radius:12px; border:1px solid #2a3340; margin-bottom:10px;" />
            <img src="image/density_slice_n3_l2_m0.png" alt="Hydrogen atom visualization" style="width:100%; max-width:800px; border-radius:12px; border:1px solid #2a3340;" />
        `,
        github: 'https://github.com/Daniel-dev287/Mekanika-kuantum---atomic-hydrogen',
        icon: 'fas fa-atom'
    },
    {
    id: 4,
    title: 'Black Hole Simulation – 2D & 3D Relativistic Physics',
    tech: 'Python · Pygame · NumPy · Matplotlib · SciPy',
    desc: 'Real-time simulation of black hole physics with 2D and 3D visualizations, including video recording and physics plots.',
    fullDesc: `
        <h3>Overview</h3>
        <p>
            This project implements a comprehensive <strong>relativistic black hole simulation</strong> 
            with both <strong>2D</strong> and <strong>3D</strong> visualisations using Pygame. 
            It models the gravitational effects around a Schwarzschild black hole, including 
            <em>gravitational time dilation</em>, <em>redshift</em>, <em>spaghettification</em> (tidal forces), 
            <em>escape velocity</em>, <em>photon sphere</em>, and <em>Hawking radiation</em>. 
            The code also generates high‑resolution physics plots and can record simulations as MP4 videos.
        </p>

        <h3>Physical Foundation</h3>
        <p>
            The simulation is based on the <strong>Schwarzschild metric</strong>, which describes the 
            spacetime around a non‑rotating, spherically symmetric black hole. Key quantities are 
            calculated using the following formulas:
        </p>
        <ul>
            <li><strong>Schwarzschild radius:</strong> \\( R_s = \\frac{2GM}{c^2} \\)</li>
            <li><strong>Gravitational time dilation:</strong> \\( \\Delta t = \\frac{\\Delta t_0}{\\sqrt{1 - R_s/r}} \\)</li>
            <li><strong>Gravitational redshift:</strong> \\( z = \\frac{1}{\\sqrt{1 - R_s/r}} - 1 \\)</li>
            <li><strong>Escape velocity:</strong> \\( v_{esc} = \\sqrt{\\frac{2GM}{r}} \\)</li>
            <li><strong>Tidal force (spaghettification):</strong> \\( F_{tidal} = \\frac{2GM \\cdot L}{r^3} \\)</li>
            <li><strong>Hawking temperature:</strong> \\( T_H = \\frac{\\hbar c^3}{8\\pi G M k_B} \\)</li>
            <li><strong>Hawking lifetime:</strong> \\( \\tau = \\frac{5120 \\pi G^2 M^3}{\\hbar c^4} \\)</li>
        </ul>
        <p>
            All physical quantities are scaled for real‑time visualisation using atomic‑like units 
            (pixels, frames), but the underlying equations remain consistent with general relativity.
        </p>

        <h3>2D Simulation (<code>blackhole.py</code> & <code>blackhole_video.py</code>)</h3>
        <p>
            The 2D version provides an interactive, real‑time simulation where users can:
        </p>
        <ul>
            <li><strong>Click</strong> to spawn particles that are then affected by the black hole’s gravity.</li>
            <li>Observe <strong>gravitational lensing</strong> (light bending) and <strong>accretion disk</strong> rotation.</li>
            <li>See particles being <strong>stretched</strong> (spaghettification) as they approach the event horizon.</li>
            <li>Witness <strong>Hawking radiation</strong> emitted from the black hole (visualised as glowing particles).</li>
            <li>Real‑time metrics: Schwarzschild radius, Hawking temperature, mass evaporation.</li>
        </ul>
        <p>
            The <code>blackhole_video.py</code> version automates the simulation to record a 30‑second 
            video with a fixed camera, generating particles in orbits, infall, and fly‑by trajectories. 
            The <code>record_video.py</code> script captures each frame and uses <strong>FFmpeg</strong> 
            to compile an MP4 file.
        </p>

        <h3>3D Simulation (<code>blackhole3D.py</code> & <code>Blackhole3D_video.py</code>)</h3>
        <p>
            The 3D version offers a more immersive experience with a <strong>fully rotatable camera</strong> 
            (mouse drag, scroll zoom). Key features include:
        </p>
        <ul>
            <li><strong>Accretion disk</strong> with 800+ particles, colour‑coded by temperature (inner: hot, outer: cool).</li>
            <li><strong>Relativistic jets</strong> emitted perpendicular to the disk, with trailing particle effects.</li>
            <li><strong>Gravitational lensing</strong> applied to background stars and disk particles.</li>
            <li><strong>Photon sphere</strong> and <strong>event horizon</strong> visualised with glow and shadow effects.</li>
            <li>Automatic camera orbit mode (toggle with Space) for cinematic views.</li>
        </ul>
        <p>
            The <code>Blackhole3D_video.py</code> version is optimised for video recording, with the camera 
            smoothly orbiting the black hole over 30 seconds. The <code>record_blackhole3d.py</code> script 
            captures frames and produces a high‑quality MP4.
        </p>

        <h3>Physics Plots & Analysis (<code>grafik_bh.py</code> & <code>perhitungan_awal.py</code>)</h3>
        <p>
            The project includes a dedicated physics analysis module that generates two sets of plots:
        </p>
        <ul>
            <li>
                <strong>Black hole properties</strong> (mass vs Schwarzschild radius, Hawking temperature, 
                Hawking lifetime, density) – all plotted on log‑log scales.
            </li>
            <li>
                <strong>Relativistic effects</strong> (time dilation, gravitational redshift, escape velocity, 
                tidal force) as functions of distance from the black hole.
            </li>
        </ul>
        <p>
            These plots are saved as high‑resolution PNG files (300 dpi) and serve as both a validation of 
            the simulation’s physics and an educational resource.
        </p>

        <h3>Code Structure</h3>
        <ul>
            <li><code>blackhole.py</code> – 2D interactive simulation.</li>
            <li><code>blackhole_video.py</code> – 2D automated video generation.</li>
            <li><code>blackhole3D.py</code> – 3D interactive simulation with camera controls.</li>
            <li><code>Blackhole3D_video.py</code> – 3D automated video generation.</li>
            <li><code>record_video.py</code> – Captures 2D simulation frames and compiles MP4.</li>
            <li><code>record_blackhole3d.py</code> – Captures 3D simulation frames and compiles MP4.</li>
            <li><code>grafik_bh.py</code> – Generates physics plots (properties & relativistic effects).</li>
            <li><code>perhitungan_awal.py</code> – Detailed physics calculations and verification.</li>
        </ul>

        <h3>Visualisation Examples</h3>
        <p>
            Below are sample outputs from the simulation and physics analysis:
        </p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:12px 0;">
            <img src="image/blackhole_properties.png" alt="Black hole properties" style="width:100%; border-radius:8px; border:1px solid #2a3340;" />
            <img src="image/relativistic_effects.png" alt="Relativistic effects" style="width:100%; border-radius:8px; border:1px solid #2a3340;" />
        </div>
        <p>
            <em>(Note: Replace placeholder images with actual generated plots and screenshots from the simulation.)</em>
        </p>
        <p>
            The 3D simulation, in particular, produces striking visuals of the accretion disk, jets, and 
            gravitational lensing, making it suitable for presentations and educational content.
        </p>

        <h3>Video Recording</h3>
        <p>
            Both 2D and 3D versions can record 30‑second MP4 videos at 60 FPS. The videos are created by 
            saving each frame as a PNG and then using FFmpeg to encode them. The resulting videos show the 
            black hole’s dynamics in a smooth, cinematic manner, ideal for sharing or embedding in other media.
        </p>

        <h3>Key Algorithms & Numerical Methods</h3>
        <ul>
            <li><strong>Euler integration</strong> with adaptive time‑stepping for particle trajectories.</li>
            <li><strong>Keplerian orbital velocity</strong> with relativistic correction factor.</li>
            <li><strong>Gravitational lensing</strong> approximated by a radial deflection proportional to \\( R_s/r \\).</li>
            <li><strong>Hawking radiation</strong> simulated as stochastic emission of particles with probability proportional to temperature.</li>
            <li><strong>Spaghettification</strong> modelled by stretching particles along the radial direction and compressing tangentially.</li>
        </ul>

        <h3>Future Work & Improvements</h3>
        <ul>
            <li>Add Kerr metric (rotating black hole) for more realistic accretion disk and frame‑dragging effects.</li>
            <li>Implement ray‑tracing for accurate gravitational lensing.</li>
            <li>Support for interactive parameter adjustment (mass, spin, particle speed).</li>
            <li>Export simulation as a standalone executable or web‑based interactive tool.</li>
        </ul>
    `,
    github: 'https://github.com/Daniel-dev287/Simulasi-Black-hole',
    icon: 'fas fa-circle-notch'
    },
    {
        id: 5,
        title: 'Rubik\'s Cube Solver – RL with PPO',
        tech: 'Python · PyTorch · Stable-Baselines3 · Gymnasium',
        desc: 'Reinforcement learning agent that solves a scrambled Rubik\'s Cube using PPO.',
        fullDesc: `
            <h3>Overview</h3>
            <p>
                This project implements a <strong>Reinforcement Learning (RL)</strong> agent capable of solving a 
                scrambled 3×3 Rubik's Cube. The agent is trained using <strong>Proximal Policy Optimization (PPO)</strong> 
                from Stable-Baselines3, with a custom Gymnasium environment that simulates the cube, applies 
                rotations, and provides rewards. The goal is to teach the agent a sequence of moves that returns 
                the cube to its solved state.
            </p>

            <h3>Environment – RubiksCubeEnv</h3>
            <p>
                The custom environment inherits from <code>gym.Env</code> and manages:
            </p>
            <ul>
                <li><strong>State representation:</strong> A 324‑dimensional binary vector (54 facelets × 6 one‑hot color channels). Each facelet is encoded as a 6‑element one‑hot vector representing one of the six colors (White, Red, Yellow, Orange, Blue, Green).</li>
                <li><strong>Action space:</strong> 12 discrete actions — rotations for each face (F, R, B, L, U, D) and their prime (counter‑clockwise) versions.</li>
                <li><strong>Scramble & reset:</strong> The cube is randomly scrambled with <code>n</code> moves (configurable). The environment resets to a scrambled state at the start of each episode.</li>
                <li><strong>Time limit:</strong> The episode terminates after a specified number of steps to prevent infinite loops.</li>
            </ul>

            <h3>State Encoding – One‑Hot Representation</h3>
            <p>
                Each color is mapped to a 6‑dimensional one‑hot vector:
            </p>
            <pre style="background:#1a2330;padding:12px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
White  → [1, 0, 0, 0, 0, 0]
Red    → [0, 1, 0, 0, 0, 0]
Yellow → [0, 0, 1, 0, 0, 0]
Orange → [0, 0, 0, 1, 0, 0]
Blue   → [0, 0, 0, 0, 1, 0]
Green  → [0, 0, 0, 0, 0, 1]
            </pre>
            <p>
                The full state is a flattened array of 54 × 6 = 324 binary values, which serves as the observation 
                for the RL agent. This encoding allows the neural network to process the cube's configuration 
                as a high‑dimensional binary input.
            </p>

            <h3>Action Implementation – Face Rotations</h3>
            <p>
                The <code>rubiks.py</code> module defines all 12 face rotations using NumPy operations:
            </p>
            <ul>
                <li>Each face is a 3×3×6 array (3×3 grid of one‑hot vectors).</li>
                <li><strong>Clockwise rotation:</strong> Rotates the face 90° clockwise and swaps the adjacent edge rows/columns between neighboring faces.</li>
                <li><strong>Counter‑clockwise (prime) rotation:</strong> Rotates the face 90° counter‑clockwise and swaps edges in the reverse order.</li>
                <li>The rotation logic is implemented for all six faces: <code>F, R, B, L, U, D</code> and their primes.</li>
            </ul>
            <p>
                The edge‑swapping mechanism ensures that the cube state remains consistent after each move.
                For example, rotating the front face moves the top edge of the front face to the left, the left
                to the bottom, the bottom to the right, and the right to the top.
            </p>

            <h3>Reward Function</h3>
            <p>
                The reward function is designed to encourage the agent to solve the cube efficiently:
            </p>
            <ul>
                <li><strong>-1 per step:</strong> A small penalty for each move to encourage shorter solutions.</li>
                <li><strong>0 on solved:</strong> The episode ends when the cube is solved, with no additional reward (neutral).</li>
                <li><strong>Time‑out penalty:</strong> If the agent exceeds the time limit, the episode terminates without solving.</li>
            </ul>
            <p>
                A potential improvement (commented out in the code) includes distance‑based shaping using 
                Manhattan distance to guide the agent toward solved states more effectively.
            </p>

            <h3>Training Process – Progressive Scrambling</h3>
            <p>
                The training loop uses a <strong>progressive curriculum</strong>:
            </p>
            <ul>
                <li>Start with 1 scramble move, train for 50,000 timesteps.</li>
                <li>Gradually increase the scramble count from 1 to 20.</li>
                <li>For each scramble level <code>s</code>, the time limit is set to <code>s²</code> (e.g., 4 moves for 2 scrambles, 25 moves for 5 scrambles).</li>
                <li>Training continues for <code>50,000 × s</code> timesteps per level.</li>
                <li>Models are saved periodically with timestamps.</li>
            </ul>

            <h3>Neural Network Architecture</h3>
            <p>
                The PPO agent uses a custom <strong>Multi‑Layer Perceptron (MLP)</strong> policy with:
            </p>
            <pre style="background:#1a2330;padding:12px;border-radius:8px;color:#b8c9e0;overflow-x:auto;">
Policy Network (π):
  Input: 324 (state)
  Hidden: 256 → 256 → 256 → 256 → 256 (ReLU)
  Output: 12 (action logits)

Value Network (V):
  Input: 324 (state)
  Hidden: 256 → 256 → 256 → 256 → 256 (ReLU)
  Output: 1 (state value)
            </pre>
            <p>
                Both networks share the same architecture but are separate networks (as configured with 
                <code>net_arch=dict(pi=[...], vf=[...])</code>). The deep architecture allows the agent to 
                capture complex patterns in the cube's state.
            </p>

            <h3>Model Saving & Evaluation</h3>
            <ul>
                <li><strong>Saving:</strong> Models are saved after each scramble level with naming like <code>model-{date}--50k-{s}s</code>.</li>
                <li><strong>Testing:</strong> The testing loop loads a trained model, scrambles the cube with a fixed number of moves, and lets the agent attempt to solve it. The success rate is recorded over 10 episodes.</li>
                <li><strong>Visualization:</strong> During testing, the cube is rendered in the terminal using ANSI colors, showing each move step by step with a 0.5‑second delay.</li>
            </ul>

            <h3>Key Algorithms & Concepts</h3>
            <ul>
                <li><strong>Proximal Policy Optimization (PPO):</strong> An on‑policy RL algorithm that optimizes a surrogate objective function while constraining policy updates to avoid destructive changes.</li>
                <li><strong>Gymnasium:</strong> The standard API for RL environments, providing <code>reset()</code> and <code>step()</code> interfaces.</li>
                <li><strong>One‑hot encoding:</strong> Transforms categorical color values into a binary vector representation suitable for neural network input.</li>
                <li><strong>Curriculum learning:</strong> Gradually increasing the difficulty (scramble count) to help the agent learn progressively harder tasks.</li>
            </ul>

            <h3>Challenges & Future Work</h3>
            <ul>
                <li><strong>Sparse reward:</strong> The only positive signal is solving the cube, which is rare for complex scrambles. Future work could explore reward shaping using Manhattan distance or subgrouping.</li>
                <li><strong>Computational cost:</strong> Training for 20 scramble levels with up to 1,000,000 timesteps is resource‑intensive.</li>
                <li><strong>Generalization:</strong> The agent tends to overfit to specific scramble lengths and may not generalize well to unseen scramble counts.</li>
            </ul>
        `,
        github: 'https://github.com/Daniel-dev287/rubik-solver',
        icon: 'fas fa-cube'
    },
    {
    id: 7,
    title: 'N-Body Gravitational Simulation – Euler vs RK4',
    tech: 'Python · Pygame · NumPy · Matplotlib',
    desc: 'Real-time N-body simulation comparing Euler and Runge-Kutta 4 integration methods.',
    fullDesc: `
        <h3>Overview</h3>
        <p>
            This project implements an <strong>N-body gravitational simulation</strong> using two 
            distinct numerical integration methods: <strong>Euler</strong> (first-order) and 
            <strong>Runge-Kutta 4</strong> (fourth-order). The simulation visualizes the motion 
            of three massive bodies under mutual gravitational attraction and provides real-time 
            energy conservation plots to compare the accuracy of both methods.
        </p>

        <h3>Physical Foundation</h3>
        <p>
            The simulation is governed by <strong>Newton's law of universal gravitation</strong>:
        </p>
        \\[ \\vec{F}_{ij} = -\\frac{G \\, m_i \\, m_j}{r_{ij}^2} \\, \\hat{r}_{ij} \\]
        <p>
            The acceleration of each body is derived from the net gravitational force:
        </p>
        \\[ \\vec{a}_i = \\sum_{j \\neq i} -\\frac{G \\, m_j}{r_{ij}^2} \\, \\hat{r}_{ij} \\]
        <p>
            The total mechanical energy of the system is the sum of kinetic and potential energies:
        </p>
        \\[ \\E_{total} = \\sum_i \\frac{1}{2} m_i v_i^2 - \\sum_{i<j} \\frac{G \\, m_i \\, m_j}{r_{ij}} \\]
        <p>
            In an ideal simulation, <strong>total energy should be conserved</strong>. The accuracy 
            of the integration method directly affects how well energy is preserved over time.
        </p>

        <h3>Integration Methods</h3>

        <h4>1. Euler Integration (<code>nbody-euler.py</code>)</h4>
        <p>
            Euler integration is a <strong>first-order</strong> method that updates position and 
            velocity using the current acceleration:
        </p>
        \\[ \\vec{v}_{n+1} = \\vec{v}_n + \\vec{a}_n \\, \\Delta t \\]
        \\[ \\vec{x}_{n+1} = \\vec{x}_n + \\vec{v}_{n+1} \\, \\Delta t \\]
        <p>
            <strong>Advantages:</strong> Simple to implement, computationally lightweight.<br>
            <strong>Disadvantages:</strong> Energy drifts over time, orbits are not stable for 
            long simulations. The error per step is proportional to \\( \\mathcal{O}(\\Delta t) \\).
        </p>

        <h4>2. Runge-Kutta 4 Integration (<code>nbody-rk4.py</code>)</h4>
        <p>
            RK4 is a <strong>fourth-order</strong> method that computes intermediate slopes 
            to achieve significantly higher accuracy:
        </p>
        \\[ \\vec{k}_1 = f(\\vec{y}_n) \\]
        \\[ \\vec{k}_2 = f(\\vec{y}_n + \\frac{\\Delta t}{2} \\vec{k}_1) \\]
        \\[ \\vec{k}_3 = f(\\vec{y}_n + \\frac{\\Delta t}{2} \\vec{k}_2) \\]
        \\[ \\vec{k}_4 = f(\\vec{y}_n + \\Delta t \\, \\vec{k}_3) \\]
        \\[ \\vec{y}_{n+1} = \\vec{y}_n + \\frac{\\Delta t}{6} (\\vec{k}_1 + 2\\vec{k}_2 + 2\\vec{k}_3 + \\vec{k}_4) \\]
        <p>
            <strong>Advantages:</strong> Energy is conserved much better, orbits remain stable 
            over long periods. The error per step is proportional to \\( \\mathcal{O}(\\Delta t^4) \\).<br>
            <strong>Disadvantages:</strong> More computationally expensive (4 derivative evaluations per step).
        </p>

        <h3>Initial Conditions</h3>
        <p>
            The simulation uses three bodies with equal mass (15,000 units each) arranged in a 
            triangular configuration with velocities that produce a stable or chaotic trajectory:
        </p>
        <ul>
            <li><strong>Body 1 (Red):</strong> Position (340, 300), Velocity (45, -45)</li>
            <li><strong>Body 2 (Blue):</strong> Position (460, 300), Velocity (-45, 45)</li>
            <li><strong>Body 3 (Green):</strong> Position (400, 120), Velocity (-45, -45)</li>
        </ul>
        <p>
            The system is initialized in the <strong>center-of-mass frame</strong> by subtracting 
            the total momentum, ensuring that the center of mass remains stationary.
        </p>

        <h3>Visualization Features</h3>
        <ul>
            <li><strong>Real-time rendering:</strong> Bodies are drawn as circles with their respective colors.</li>
            <li><strong>Trails:</strong> Each body leaves a trail of its path (up to 300 points).</li>
            <li><strong>Debug information:</strong> Position, velocity, mass, and distance between bodies are displayed.</li>
            <li><strong>Energy plot:</strong> A live matplotlib graph shows total energy over time.</li>
            <li><strong>Softening parameter:</strong> A small softening factor (ε = 5) prevents numerical singularities when bodies are close.</li>
        </ul>

        <h3>Energy Conservation Comparison</h3>
        <p>
            The key difference between Euler and RK4 is visible in the energy conservation plot:
        </p>
        <ul>
            <li><strong>Euler:</strong> Energy drifts noticeably over time (increases or decreases monotonically).</li>
            <li><strong>RK4:</strong> Energy remains nearly constant, with only small oscillations.</li>
        </ul>
        <p>
            This demonstrates why higher-order integration methods are essential for long-term 
            gravitational simulations, such as those used in astrophysics and orbital mechanics.
        </p>

        <h3>Code Structure</h3>
        <ul>
            <li><code>bodies.json</code> – JSON configuration file for initial positions, velocities, masses, and colors.</li>
            <li><code>nbody-euler.py</code> – Euler integration implementation with pygame visualization and real-time energy plot.</li>
            <li><code>nbody-rk4.py</code> – RK4 integration implementation with the same visualization features.</li>
        </ul>

        <h3>Key Algorithms & Numerical Methods</h3>
        <ul>
            <li><strong>Newtonian gravity:</strong> \\( F = G \\, m_1 \\, m_2 / r^2 \\)</li>
            <li><strong>Euler integration:</strong> First-order ODE solver.</li>
            <li><strong>Runge-Kutta 4:</strong> Fourth-order ODE solver with significantly better accuracy.</li>
            <li><strong>Center-of-mass correction:</strong> Removes net momentum to keep the system stable.</li>
            <li><strong>Real-time plotting:</strong> Matplotlib embedded with pygame for live energy monitoring.</li>
        </ul>

        <h3>Future Work & Improvements</h3>
        <ul>
            <li>Add more integration methods (Verlet, Leapfrog) for comparison.</li>
            <li>Implement adaptive time-stepping for better accuracy when bodies are close.</li>
            <li>Support for interactive body creation and parameter adjustment.</li>
            <li>Export simulation as video with multiple integration methods side-by-side.</li>
        </ul>
    `,
    github: 'https://github.com/Daniel-dev287/nbody-simulation', // adjust to your actual repo
    icon: 'fas fa-circle' // or fa-gravity, fa-star
    }
];

// ===== RENDER PROJECT CARDS =====
const grid = document.getElementById('projectGrid');

projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-content">
            <div class="icon"><i class="${p.icon}"></i></div>
            <h3>${p.title}</h3>
            <div class="tech">${p.tech}</div>
            <p>${p.desc}</p>
            <button class="btn-detail" onclick="openDetail(${p.id})">View Details</button>
        </div>
    `;
    grid.appendChild(card);
});

// ===== OPEN DETAIL =====
function openDetail(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    document.getElementById('main-page').classList.add('hidden');
    document.getElementById('detailPage').classList.add('active');

    document.getElementById('detailTitle').textContent = project.title;
    document.getElementById('detailTech').textContent = project.tech;
    document.getElementById('detailDesc').textContent = project.desc;
    document.getElementById('detailFullDesc').innerHTML = project.fullDesc;
    document.getElementById('detailGithub').href = project.github;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re‑render MathJax if present
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    } else if (window.MathJax && MathJax.typeset) {
        MathJax.typeset();
    }
}

// ===== CLOSE DETAIL =====
function closeDetail() {
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('detailPage').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== NAVIGATION: close detail when clicking nav links =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (document.getElementById('detailPage').classList.contains('active')) {
            closeDetail();
        }
    });
});
document.querySelector('a[href="#projects"]')?.addEventListener('click', function() {
    if (document.getElementById('detailPage').classList.contains('active')) closeDetail();
});
document.querySelector('a[href="#contact"]')?.addEventListener('click', function() {
    if (document.getElementById('detailPage').classList.contains('active')) closeDetail();
});

// ===== HAMBURGER MENU =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Mencegah browser berpindah halaman / 404

        formStatus.className = 'form-status loading';
        formStatus.textContent = 'Sending message...';

        const formData = new FormData(contactForm);

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Pesan berhasil terkirim!';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Gagal mengirim pesan. Silakan coba lagi.';
        });
    });
}