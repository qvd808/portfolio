export const TERM = [
  { cmd: 'chronyc tracking | grep -i skew', out: 'held under one millisecond across concurrent embedded targets' },
  { cmd: 'git log --oneline esp-idf | grep XPT2046', out: 'SPI touchscreen driver, merged upstream into espressif/esp-idf' },
  { cmd: 'ctest --output-on-failure -R mahony', out: 'sensor fusion, tested on the host. no robot required.' },
  { cmd: 'arm-none-eabi-gdb build/firmware.elf', out: 'no vendor HAL: startup code, linker script, vector table, mine' },
  { cmd: 'dafny verify factor.dfy', out: 'the habit that took me from verifying a CPU to verifying AI output' },
];

export const FACTS = [
  { big: '2 upstream PRs', sub: "A touchscreen driver in Espressif's ESP-IDF, and AVX overflow tests in simd-everywhere/simde. Both upstream." },
  { big: 'Since Jan 2025', sub: 'Firmware without a gap: eight months full time at Schneider Electric on solar inverter boards, and SFU Robot Soccer throughout.' },
  { big: 'Apr 2026', sub: 'B.Sc Computing Science at SFU. Pursuing future career in firmware and AI related areas.' },
];

export const OSS = [
  {
    repo: 'espressif/esp-idf', href: 'https://github.com/espressif/esp-idf',
    what: "An XPT2046 SPI touchscreen driver, merged into Espressif's official IoT framework.",
  },
  {
    repo: 'simd-everywhere/simde', href: 'https://github.com/simd-everywhere/simde',
    what: "x86 AVX overflow test coverage. Mostly an exercise in finding the edges of someone else's SIMD implementation.",
  },
];

export const ACTS = [
  {
    no: 'Act I', when: '2021 – 2022', where: 'VIRENTO · 3rd place in a startup competition',
    title: 'Learning what engineering practice actually is',
    lede: "I started out on the backend for a startup idea and picked it up fast, fast enough to feel competent, which is a dangerous place to be. Then I led three engineers on VIRENTO, a peer rental marketplace, and got my first real lesson in why practice matters, not just code that runs.",
    beats: [
      'Wrote the PostgreSQL schema and the indexed queries behind search and booking, with React and Next.js over Node on top.',
      'Deployed it on AWS, but placed the database far away from the EC2 instance. Every request paid for that in latency, and latency is a product problem, not just an engineering one.',
    ],
    takeaway: "We were students optimising for cost, and I hadn't yet learned that cost and performance are two different decisions you make at the same time, or that a user feels the distance between a database and a server as a worse product. Distance is a design choice. I think about data locality, and about the practice behind the code, because I once didn't.",
  },
  {
    no: 'Act II', when: 'Mid 2022', where: 'Forget me Not · An Android application for dementia patients',
    title: 'An application solving real life problem',
    lede: "A course assignment: build a mobile application for people living with dementia, so they could reach the people they love. It was the first time the thing I was building had a person at the end of it.",
    beats: [
      'Built the app in Java with video calling through a third-party SDK, and kept the meeting notes and development record as the requirements shifted underneath us.',
    ],
    takeaway: "This is where the word engineer stopped being a job title for me. Building an actual solution to somebody's actual problem is the part I'm in this for, and everything after is me chasing more of it.",
  },
  {
    no: 'Act III', when: 'Sep 2022 – Dec 2023', where: 'Atimi Software · Vancouver',
    title: "Sitting with people's problems, then proposing a fix",
    lede: "I held dual roles as a Junior Software Engineer in R&D and IT Associate. Delivering a client-facing React Native and Firebase application, while sitting with colleagues, walking through their day-to-day problems, and realising I could apply what I knew to actually help.",
    beats: [
      'It started with a template email I proposed to my manager to save people repeating themselves on HR on/offboarding. That grew into syncing between a cloud solution and Microsoft 365, then full onboarding and offboarding scripts in Python and PowerShell, covering over 100 employees.',
      'Power Automate flows with JavaScript connectors against the HR systems of record, hardened with retries, typed payloads and failure logging, which improved data throughput and accuracy by about 30%.',
    ],
    takeaway: 'Sitting with the person who has the problem is the fastest requirements gathering there is. I write code to help people, and automation was just the shortest path from one to the other.',
  },
  {
    no: 'Act IV', when: 'Jun 2024 – Mar 2026', where: 'SFU Blueprint · pro-bono builds for two non-profits',
    title: 'Discipline, at team scale',
    lede: "Volunteering to help a non-profit was where the discipline from Atimi had to scale up: not just my own standards, but a team's, shipping to real people against a real deadline. Two projects, two teams of about ten — a check-in system for a community bike shop, then a volunteer platform for the Regional Animal Protection Society.",
    beats: [
      "On PEDALS I owned the volunteer side end to end: the check-in and check-out kiosk with its API, access-code validation and rotation, and the manager's data export. The design kept moving under me — I re-integrated the designers' mocks each round, and rebuilt the export page when the route structure was reorganised.",
      'On RAPS I built full-CRUD REST APIs in TypeScript, Node and Express over MongoDB, on a controller/service/repository structure with role-based access control and hashed-password auth.',
      'Then added rate-limiting middleware, Swagger/OpenAPI docs, and Jest unit and route tests — and put the test step into the GitHub Actions pipeline so it gates merges, while the design kept evolving under deadline pressure and the team kept shipping through it.',
    ],
    takeaway: "The pipeline that blocks a bad merge was the part I chose to add. Nobody asked for it, and I'm the only person who has ever touched that workflow file. It just felt wrong to ship something volunteers rely on without a gate in front of it, and doing that well as a team, not just solo, is the discipline this Act taught me.",
  },
  {
    no: 'Act V', when: 'May – Aug 2024', where: 'Parabix · Faculty project',
    title: 'The curiosity that pointed me at firmware',
    lede: "Applied compiler design and computer architecture principles to a professor's open-source project, enabling GPU usage by utilizing LLVM to compile C++ into NVIDIA PTX assembly. This is where I first got curious about what's underneath the code I write.",
    beats: [
      'Implemented parallelised GPU word-count logic through that pipeline, landing roughly 70% faster than the CPU baseline.',
      'Word counting is a solved, boring problem at the top. At the level of instruction selection and memory movement it is not boring at all, and that gap is what made me curious about firmware.',
    ],
    takeaway: "Word counting is a solved problem until you follow it down to instruction selection and memory movement, where it turns into a genuinely hard one. That's the habit this project left me with: when something feels boring, go look at the mechanism underneath it. It's also the moment I realised firmware, the layer closest to that mechanism, was what I actually wanted to chase.",
  },
  {
    no: 'Act VI', when: 'Jan 2025 – present', where: 'SFU Robot Soccer Design Team',
    title: 'Solving real problems in firmware',
    lede: 'I joined the firmware side. A competitive robotics team has one set of hardware and a queue of people who need it.',
    beats: [
      'Engineered SPI integration for the LSM6DSL IMU, validating gyroscope and accelerometer timing, calibration and noise well enough to trust inside a closed control loop.',
      'Wrote GoogleTest coverage for the Mahony sensor-fusion filter, covering numerical stability and algorithm correctness, not just whether it compiles.',
      'Refactored the firmware to mock hardware timers and dependencies so it simulates on a host, which is what made reliable GitLab CI on every build possible.',
    ],
    takeaway: 'Simulating the sensor path on a host meant every commit got tested automatically, on top of the validation we already did on the robot. That extra layer of continuous checking is what let the team trust the control loop under competition pressure.',
  },
  {
    no: 'Act VII', when: 'Jan – Aug 2025', where: 'Schneider Electric · Richmond, BC',
    title: 'Bridging code and physical machines',
    lede: 'A firmware co-op on energy hardware: inverters converting between DC and AC for solar and battery storage. It was a real product with real safety expectations, split across four assignments.',
    beats: [
      'Engineered an SNTP/PTP time-synchronisation subsystem in Docker, holding clock skew under one millisecond across concurrent embedded network targets.',
      'Built a containerised Python release-validation service replaying regression suites across networked targets, which surfaces nondeterministic state bugs before a release instead of after one.',
      "Applied internal AI agents to automate debug triage and test-pipeline verification, cutting the team's manual investigation time.",
      'Migrated a legacy firmware codebase to modern safety-oriented standards, finishing in two months while working async across time zones.',
    ],
    takeaway: "Working alongside real hardware for those eight months made the ceiling clear: some problems just aren't reachable from inside software, and I'd rather go learn that side than pretend otherwise. Claude Shannon knew this before computer science had a name; his master's thesis is why logic and circuits ended up being the same subject.",
  },
  {
    no: 'Act VIII', when: 'Jan 2026 – now', where: 'risc-v-logism · personal research and project',
    title: 'What hardware verification taught me about taming AI hallucinations',
    lede: '"If we can verify correctness for every input in hardware, can we do the same for AI to confirm its validity?" — A question that came up while building a single-cycle RV32I processor from scratch (instruction layout, PC logic, ALU, register file).',
    beats: [
      'I learned about formal verification and Dafny while wanting to make sure the hardware datapath is correct for every input, not just the tests I covered. Have proofs rather than samples, machine-checked obligations rather than a suite that happened to pass.',
      "And the same machinery that proves a circuit right is the machinery I'd want for checking code an AI model wrote. That's the moment AI became interesting to me, not the other way round.",
      "It's also where I met the Arthur–Merlin model: a powerful prover convincing a verifier that can't do the work but can always check. factor_rl and CAT are that idea as working code.",
    ],
    takeaway: "That's how I ended up interested in AI: not through AI itself, but through trying to prove a processor correct and finding the exact same question sitting wide open one level up. It's the direction I want to spend the next few years in, without leaving the hardware behind.",
  },
];

export const CASES = [
  {
    repo: 'Schneider Electric · co-op', stack: 'STM32 · SNTP/PTP · Docker · Python', status: 'Jan–Aug 2025',
    title: 'A clock that stays inside a millisecond, containerised for real hardware',
    problem: "Bugs that only show up when two machines disagree about the time are bugs you can't reproduce by reading code. I was given the time-synchronisation subsystem itself: get it running against real hardware, not a mock.",
    did: 'Engineered an SNTP/PTP time-sync subsystem, containerised in Docker and wired to talk to the STM32 target over the network rather than bench-wired to one board; clock skew held under a millisecond.',
    hardLabel: 'The hard part',
    hard: "Getting the container to actually talk to the STM32 target in real time, not just simulate it. Time-sync bugs don't show up by reading code — they show up when two machines briefly disagree — so most of the work was in the connection itself, not the protocol logic on paper.",
    limits: "This was a co-op on a team, on an established codebase: I owned these subsystems, not the product architecture. I also can't share the source, so what I can offer is a whiteboard walkthrough of the design and its failure modes.",
    href: 'https://www.linkedin.com/in/qvd-dang/', linkLabel: 'Full detail on my résumé',
  },
  {
    repo: 'SFU Robot Soccer · firmware', stack: 'C++ · SPI · LSM6DSL · GoogleTest · GitLab CI', status: 'Jan 2025 – present',
    title: 'Testing robot firmware on every commit, not just on the robot',
    problem: 'One set of hardware serves a queue of people who all need it at once, so time on the robot itself is scarce. I wanted a way to test continuously on top of that, not instead of it.',
    did: 'Brought up SPI integration for the LSM6DSL IMU, validating gyroscope and accelerometer timing, calibration and noise for closed-loop control. Wrote GoogleTest coverage for the Mahony sensor-fusion filter covering numerical stability and algorithm correctness. Then refactored the firmware to mock hardware timers and dependencies so the whole thing simulates on a host, enabling GitLab CI on every build.',
    hardLabel: 'The hard part',
    hard: "Mocking time. A sensor-fusion filter is a function of its own timing, so faking the timer means deciding exactly which parts of the hardware's behaviour a test is allowed to assume, and getting that wrong gives you passing tests and a robot that doesn't work.",
    limits: "Volunteer work on a student design team, not a shipped product. The control loop as a whole isn't mine; the sensor path, its tests and the simulation harness are.",
    href: 'https://github.com/qvd808', linkLabel: 'Ask me to walk through the harness',
  },
  {
    repo: 'qvd808/bare-metal-stm32 · espressif/esp-idf', stack: 'C · Cortex-M4 · CMake · GDB · OpenOCD', status: 'Active',
    title: 'Proving to myself I understood the chip, not the wizard',
    problem: "Understanding a chip and understanding a vendor's abstraction of it are two different things, and I wanted to know which one I actually had. So: the same class of chip as my co-op, with nothing generated for me this time.",
    did: "Built a bare-metal STM32F4 runtime (startup code, custom linker scripts, vector tables and memory layouts, no vendor HAL), then brought up GPIO, UART and SysTick drivers from the reference manual: alternate function AF7 on PA2/PA3, the APB1 prescaler resolved out of RCC_CFGR to compute the baud divisor, printf retargeted through newlib's _write. Verified at the register level under GDB and OpenOCD. Separately, an XPT2046 touchscreen driver of mine is merged into Espressif's ESP-IDF.",
    hardLabel: 'The unglamorous part',
    hard: "Everything the toolchain normally hides: __libc_init_array undefined at link time, choosing which libc stubs to provide so the linker is satisfied without dragging in weight the chip can't spare, and getting .data and .bss initialised before main runs.",
    limits: "Still in progress, and the repo's to-do list says so: interrupt-driven UART with a ring buffer isn't written yet. I'd want a datasheet refresher before a deep interview on peripherals I haven't touched recently.",
    href: 'https://github.com/qvd808/bare-metal-stm32', linkLabel: 'Read the notes and to-do',
  },
  {
    repo: 'qvd808/risc-v-logism', stack: 'SystemVerilog · Logisim · Altera FPGA', status: 'Jan 2026 – present',
    title: 'The CPU that sent me looking for proofs',
    problem: 'I wanted to understand a processor by building one, not by reading about one. A single-cycle RV32I core: instruction encoding, program counter logic, ALU, register file, control.',
    did: 'Architected the datapath and mapped the RV32I instruction set onto it, verified the core components in Logisim where I could see the wires before committing to HDL, then wrote SystemVerilog for synthesis and hardware integration on Altera FPGA.',
    hardLabel: 'What it opened',
    hard: 'Testing a datapath only tells you it works on the inputs you thought of. That gap pushed me into formal verification and Dafny, and from there into the question of whether the same proof machinery can check code a model generated.',
    limits: "Single-cycle, deliberately. It's not pipelined, so it's not efficient. The goal was to learn Verilog and CPU architecture properly, and I'd rather have a simple design I fully understand than a pipelined one I don't.",
    href: 'https://github.com/qvd808/risc-v-logism', linkLabel: 'Read the implementation',
  },
  {
    repo: 'qvd808/factor_rl · qvd808/CAT', stack: 'Python · RL · LangGraph · Pydantic', status: 'Live demo · experiment',
    title: 'AI, with something that can prove it wrong',
    problem: 'If I want to work on verifying machine-generated output, I should build systems that need verifying. Two: an RL agent that learns a factoring strategy rather than an algorithm, and a multi-agent pipeline that writes code.',
    did: 'factor_rl trains an agent whose learned policy steers a search over a binary expression-tree state space, with a live step-through demo backed by a hosted inference API. The question: whether a strategy learned on low degrees extrapolates to degrees it never saw. CAT is a stateful six-agent LangGraph pipeline (PM, Architect, Tech Strategist, Design Critic, Builder, QA) that turns plain-English requirements into runnable prototypes.',
    hardLabel: 'The check',
    hard: 'Neither system is trusted. factor_rl re-derives every answer with exact integer arithmetic against an independent exhaustive factorizer and reports verified, incomplete or wrong as distinct outcomes. CAT runs its Design Critic before the Builder writes anything, with Pydantic-enforced outputs keeping a weak model inside its lane.',
    limits: "factor_rl handles irreducible factors up to degree 3 with bounded coefficients; x^16 - 1 is where you can watch it hit the ceiling. CAT's output is mediocre: free-tier Llama 3.3 70B is decent, but nowhere close to frontier models for software work. What transfers is the pipeline and the contracts, not the generated code.",
    href: 'https://qvd808.github.io/factor_rl/', linkLabel: 'Open the live demo',
  },
];

export const DEPTH = [
  { id: 'mcu', code: '§ silicon', title: 'MCU & architecture', items: [
    { name: 'STM32', deep: true, detail: 'Cortex-M4 bare-metal from the reference manual, and Cortex-M7 work at Schneider: clock tree, MPU, peripherals.' },
    { name: 'ESP32', detail: 'ESP-IDF, BLE peripheral, SPI displays. My XPT2046 touchscreen driver is merged upstream.' },
    { name: 'Cortex-M', detail: 'Vector tables, SysTick, HardFault debugging, MPU attributes: shareable, cacheable, execute-never.' },
    { name: 'RISC-V', detail: 'Architected a single-cycle RV32I datapath: PC logic, ALU, register file. Logisim first, then SystemVerilog.' },
    { name: 'FPGA', detail: 'Altera. Verified the CPU in Logisim before synthesising it, which saved a lot of guessing.' },
    { name: 'GPU / PTX', detail: 'LLVM to NVIDIA PTX on the Parabix project. Assembly at both ends of the size scale.' },
  ]},
  { id: 'sys', code: '§ systems', title: 'Systems & protocols', items: [
    { name: 'SNTP / PTP', deep: true, detail: "Time synchronisation held under a millisecond across concurrent embedded targets. My co-op's core deliverable." },
    { name: 'SPI / I2C', detail: 'IMU integration on the robotics team: timing, calibration and noise validated for a closed loop.' },
    { name: 'UART / DMA', detail: 'Configured from the manual: baud derived from the APB1 clock, and the DMA path to the peripheral bus.' },
    { name: 'BLE / GATT', detail: 'Peripheral role: characteristics for commands and status, with automatic reconnect.' },
    { name: 'FreeRTOS', detail: 'Task priorities and modularisation, plus the SysTick bugs you meet during a rewrite.' },
    { name: 'Linkers', detail: 'Custom scripts, memory regions, _estack, and what libc quietly expects before main.' },
  ]},
  { id: 'verify', code: '§ verification', title: 'Test & verification', items: [
    { name: 'Host sim', deep: true, detail: 'Mocking hardware timers so firmware runs off-target. The change that made CI on every build possible.' },
    { name: 'GoogleTest', detail: 'Unit coverage on embedded C++ — numerical stability, not just compilation.' },
    { name: 'Regression replay', detail: 'A containerised service replaying suites across networked targets to catch nondeterministic state bugs.' },
    { name: 'GDB/OpenOCD', detail: 'Register-level validation. Where the debugging half of the day goes.' },
    { name: 'Formal methods', detail: 'Dafny — machine-checked proof obligations. Where verifying a CPU took me.' },
    { name: 'CI/CD', detail: 'GitLab and GitHub Actions on firmware repos. A build that breaks loudly beats a build on my laptop.' },
  ]},
  { id: 'code', code: '§ languages', title: 'Languages', items: [
    { name: 'C', deep: true, detail: 'My primary language. Register-level drivers, bare-metal runtimes, multi-threaded servers.' },
    { name: 'C++', detail: 'On the job migrating legacy C for safety, and on the robotics team with GoogleTest.' },
    { name: 'Python', detail: 'Release validation, build tooling, code generation, ML. My second language by volume.' },
    { name: 'SystemVerilog', detail: 'RTL for the RISC-V core, written for synthesis rather than simulation alone.' },
    { name: 'Rust / Go', detail: 'Rust in side projects; Go behind AWS Lambda handlers on a current app. Both by choice.' },
    { name: 'TypeScript', detail: 'Two years professionally. Still the fastest way for me to put a front end on something.' },
  ]},
  { id: 'ai', code: '§ ai', title: 'AI & machine learning', items: [
    { name: 'RL from parts', detail: 'DQN written out by hand: model, replay buffer, target network, training loop. No framework wrapper.' },
    { name: 'Policy search', detail: 'factor_rl — a learned policy steering search over an expression tree instead of a fixed algorithm.' },
    { name: 'Agent graphs', detail: 'Stateful LangGraph pipelines with typed hand-offs. Six roles, a critic gating the builder.' },
    { name: 'PyTorch', detail: 'My default. I would rather write the loop than configure a trainer.' },
    { name: 'Verified output', detail: "Exact-arithmetic checks and typed contracts as the cheapest verifier on a model's answer." },
    { name: 'TinyML', detail: 'The direction I want, not a claim I make yet. Next step: a quantised model on the ESP32-C6 on my desk.' },
  ]},
];

export const ENDPOINTS = [
  { label: 'CV', path: 'resume.pdf', href: 'https://drive.google.com/file/d/1IM4YwjO-NO8uF1Qor7D95fOap3vGtt5V/view' },
  { label: 'GIT', path: 'github.com/qvd808', href: 'https://github.com/qvd808' },
  { label: 'IN', path: 'linkedin.com/in/qvd-dang', href: 'https://www.linkedin.com/in/qvd-dang/' },
  { label: 'MAIL', path: 'dqvinh101@gmail.com', href: 'mailto:dqvinh101@gmail.com' },
];
