# Duration & Convexity Lab

An interactive visual learning lab for understanding how interest-rate movements affect bond prices, and how **Duration** and **Convexity** explain those changes.

The product is designed to help learners move from formula memorization to practical intuition through a structured journey:

> **See → Understand → Predict → Apply → Validate**

## Why This Project Exists

Duration and Convexity are often introduced as formulas before learners understand the underlying price-yield relationship.

This lab takes a different approach:

- Start with the bond price-yield curve
- See Duration as the first-order, straight-line effect
- See Convexity as the second-order correction for curvature
- Connect both measures to the Taylor expansion
- Apply the concepts in an interactive Playground
- Compare the approximation with full bond repricing

The goal is not to replace a pricing or risk system. The goal is to build intuition, make the approximation transparent, and show when full repricing remains necessary.

## Live Demo

After GitHub Pages is enabled, add the public demo link here:

`https://jessica8678.github.io/Duration-and-Convexity/`

## Product Preview

Add final screenshots to the `assets/` folder and keep the following file names:

### Learning Modules

![Duration and Convexity learning module](assets/learning-module.png)

### Playground

![Duration and Convexity Playground](assets/playground.png)

## Target Users

The lab is designed for:

- Market Risk Analysts
- Fixed-Income and Rates Professionals
- Traders and Treasury Professionals
- Graduate Analysts
- Finance Students
- Professionals who want an intuitive introduction before moving into more advanced quantitative material

## Learning Journey

### 1. Bond Price vs Yield

See the inverse relationship between yield and bond price and observe that the relationship is curved rather than linear.

### 2. Duration

Understand Duration as the first-order estimate of the bond price response to a change in yield.

### 3. Convexity

See how Convexity corrects the error created by using a straight-line approximation on a curved price-yield relationship.

### 4. Taylor Expansion

Connect Duration and Convexity to the first and second terms of the Taylor expansion and validate the approximation against full repricing.

### 5. Playground

Apply the concepts in a standalone interactive page:

1. Build a bond by changing coupon and maturity
2. Apply an interest-rate shock
3. Predict the direction of the price move
4. Run the scenario
5. Decompose the result into Duration, Convexity, and higher-order residual
6. Compare Duration-only, Duration-plus-Convexity, and full repricing
7. Try the opposite shock and discover the asymmetry created by positive convexity

## Key Features

- Unified left-side navigation across all modules
- Interactive coupon, maturity, starting-yield, and yield-shock controls
- Dynamic bond price-yield curve
- Current and shocked bond-price points
- Duration contribution to the price change
- Convexity contribution to the price change
- Higher-order residual
- Duration-only approximation
- Duration-plus-Convexity approximation
- Full repricing benchmark
- Scenario-driven discovery messages
- Opposite-shock comparison
- Responsive layout for desktop, tablet, and mobile use
- Single-file application with no runtime dependencies

## Core Methodology

For a bond price function \(P(y)\), the second-order approximation is:

\[
P(y + \Delta y) \approx P(y) + P'(y)\Delta y + \frac{1}{2}P''(y)(\Delta y)^2
\]

The approximate price change is therefore:

\[
\Delta P \approx \underbrace{P'(y)\Delta y}_{\text{Duration contribution}} + \underbrace{\frac{1}{2}P''(y)(\Delta y)^2}_{\text{Convexity contribution}}
\]

The lab compares this approximation with full repricing:

\[
\text{Higher-order residual} = \text{Full repricing change} - \text{Duration contribution} - \text{Convexity contribution}
\]

Full repricing remains the benchmark. The residual shows the part of the price move not captured by the second-order approximation.

## Model Assumptions

The current educational version uses a deliberately simplified bond model:

- Face value of 100
- Annual coupon payments
- One flat yield applied to all cash flows
- Yield to maturity used as the discount rate
- Settlement on a coupon date
- No accrued interest
- No credit spread or default risk
- No tax effects
- No embedded calls, puts, or prepayment options
- No key-rate or multi-curve risk decomposition

These assumptions keep the learning experience focused on Duration, Convexity, and Taylor approximation. They should not be interpreted as a production valuation methodology.

## Controls and Validation

The product is designed as a transparent learning and decision-support tool, not as a decision-maker.

Key controls include:

- One calculation path for bond price, Duration, Convexity, and full repricing
- Explicit reconciliation of the approximation to full repricing
- Separate presentation of the higher-order residual
- Consistent color semantics for Duration, Convexity, residual, gains, and losses
- Input limits for coupon, maturity, yield, and yield shocks
- Visible methodology assumptions
- No external data connections
- No user data collection
- No network dependency during use

## How to Run Locally

### Option 1: Open the HTML file

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. If the browser displays a static-preview warning, download the file and open it locally rather than using a repository preview pane.

### Option 2: Run a local web server

From the repository directory, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Repository Structure

```text
Duration-and-Convexity/
├── index.html                     # Latest application
├── README.md                      # Product overview and instructions
├── CHANGELOG.md                   # Release history
├── SPEC.md                        # Design and calculation invariants
├── STUDY.md                       # Reader-testing guidance
├── LICENSE                        # Repository license
├── assets/
│   ├── learning-module.png        # Learning-module screenshot
│   └── playground.png             # Playground screenshot
└── test/
    └── baseline.test.js           # Baseline calculation checks
```

Older HTML versions should be moved to an `archive/` folder or clearly marked as legacy so that `index.html` remains the single release version.

## Testing

If Node.js and the repository test dependencies are available:

```bash
npm install
npm test
```

The release acceptance test should also cover:

- Navigation between all five modules
- Complete separation of the Playground from Modules 1–4
- Coupon and maturity controls
- Negative, zero, and positive yield shocks
- Opposite-shock and reset actions
- Price reconciliation:

```text
Starting Price
+ Duration Contribution
+ Convexity Contribution
+ Higher-order Residual
= Full Repriced Price
```

- Desktop, tablet, and mobile layouts
- Text containment and chart-label visibility
- Keyboard access to navigation and controls

## Release Acceptance Criteria

A release is accepted when:

- All five navigation items open the correct page state
- The Playground does not appear below another module
- Bond-price calculations update consistently after input changes
- Duration, Convexity, and residual reconcile to full repricing
- Invalid scenarios do not produce broken charts or non-finite values
- Opposite Shock and Reset work correctly
- No text overlaps, clips, or leaves its card at supported screen sizes
- The application loads without JavaScript errors
- The README, screenshots, and release notes match the published version

## Responsible Use

This repository is an educational demonstration.

It is not intended for:

- Trade valuation
- Investment recommendations
- Regulatory reporting
- Limit monitoring
- Hedging decisions without independent verification
- Production risk calculations

Users should independently validate all calculations before applying the concepts to real portfolios or financial decisions.

## Product Design Principles

The product follows five principles:

1. **Visual first**: show the curve and movement before introducing formulas.
2. **One learning objective at a time**: avoid unnecessary instruments and advanced topics.
3. **Prediction before reveal**: encourage the learner to form an expectation before seeing the result.
4. **Approximation must be validated**: compare Duration and Convexity with full repricing.
5. **Simplicity over completeness**: include only elements that directly support the learning objective.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Inline SVG for interactive charts
- No framework
- No external runtime dependency
- No backend
- No external API

The product was developed through an AI-assisted workflow. Product direction, financial methodology, validation logic, scope decisions, and learning design were defined and reviewed from a market-risk perspective.

## Roadmap

Potential future improvements will be driven by user feedback rather than feature expansion for its own sake.

Possible areas include:

- Structured usability testing with new analysts
- Improved accessibility and keyboard navigation
- Additional release tests for edge cases
- Clearer learning analytics without collecting personal data
- Optional semiannual coupon convention
- A lightweight explanatory assistant, only if it materially improves learning

Out of scope for the current version:

- Swaps and swaptions
- Futures convexity adjustment
- Callable or prepayable instruments
- Key-rate duration
- Multi-curve pricing
- Volatility models
- Portfolio aggregation
- Trading or hedging recommendations

## Project Status

**Release candidate**

The product is functionally structured for public release. Final publication should follow successful browser-based release acceptance testing, screenshot review, and confirmation that no internal or confidential information is included.

## Author

**Jing Bao**  
Market Risk | Rates | AI Product Development

GitHub: [jessica8678](https://github.com/jessica8678)

## Repository

[View the Duration and Convexity repository](https://github.com/jessica8678/Duration-and-Convexity)

## License

Add the selected open-source license to the `LICENSE` file and update this section accordingly.

If no license has been selected, all rights remain reserved by default. Do not label the project as MIT, Apache 2.0, or another open-source license until the corresponding `LICENSE` file has been added.

## Feedback

Feedback is welcome through GitHub Issues. Useful feedback includes:

- Which concept became clearer after using the lab
- Which step or label was confusing
- Whether the Playground improved understanding
- Whether the visual decomposition matched the learner's expectation
- Any calculation, accessibility, or layout issue that can be reproduced
