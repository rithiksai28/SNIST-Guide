import { AcademicYear, DepartmentConfig, Subject } from '../types';

/**
 * ============================================================================
 * SNIST GUIDE - CENTRAL ACADEMIC CONFIGURATION & SUBJECT DATA
 * ============================================================================
 * 
 * HOW TO ADD OR EDIT A SUBJECT (FUTURE EDITING GUIDE):
 * ----------------------------------------------------------------------------
 * 1. Locate the target Year ('first-year', 'second-year', 'third-year', 'fourth-year').
 * 2. Locate the target Semester ('sem-1' through 'sem-8').
 * 3. Add or edit a subject object inside the `subjects` array:
 * 
 *    {
 *      id: 'y2-s1-my-subject-unique-id',
 *      name: 'NEW SUBJECT NAME',
 *      code: '22CS305PC',                         // optional course code
 *      departments: ['DS', 'CSE', 'COMMON'],      // one or more departments from DEPARTMENTS_LIST
 *      status: 'RESOURCES AVAILABLE',             // 'RESOURCES AVAILABLE' or 'COMING SOON'
 *      driveUrl: 'https://drive.google.com/...',  // Google Drive folder link
 *      description: 'Brief overview of topics',   // optional description
 *      categoryTags: ['Lecture Notes', 'Papers'], // optional tags
 *      semesterId: 'sem-3',
 *      semesterTitle: 'SEMESTER I (3RD SEM)',
 *      yearId: 'second-year',
 *      yearTitle: 'SECOND YEAR'
 *    }
 * 
 * The subject will automatically appear in:
 * - The Semester Subject Dashboard
 * - The dynamic Department filter (e.g. 'ALL', 'DS', 'CSE', 'COMMON')
 * - Search by Subject Name and Department
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * SUPPORTED DEPARTMENTS CONFIGURATION
 * ----------------------------------------------------------------------------
 * To add a new department in the future, simply append it to this array.
 * The dashboard filter tabs and search indexes will automatically update!
 */
export const DEPARTMENTS_LIST: DepartmentConfig[] = [
  { id: 'COMMON', label: 'COMMON', fullName: 'Common to all branches' },
  { id: 'DS', label: 'DS', fullName: 'Data Science' },
  { id: 'AIML', label: 'AIML', fullName: 'Artificial Intelligence & Machine Learning' },
  { id: 'CSE', label: 'CSE', fullName: 'Computer Science (CSE)' },
  { id: 'CS', label: 'CS', fullName: 'Computer Science' },
  { id: 'IT', label: 'IT', fullName: 'Information Technology' },
  { id: 'ECE', label: 'ECE', fullName: 'Electronics & Communication Engineering' },
  { id: 'EEE', label: 'EEE', fullName: 'Electrical & Electronics Engineering' },
  { id: 'MECHANICAL', label: 'MECHANICAL', fullName: 'Mechanical Engineering' },
  { id: 'CIVIL', label: 'CIVIL', fullName: 'Civil Engineering' },
];

/**
 * ----------------------------------------------------------------------------
 * ACADEMIC YEARS, SEMESTERS & SUBJECTS HIERARCHY
 * ----------------------------------------------------------------------------
 */
export const ACADEMIC_YEARS: AcademicYear[] = [
  // ==========================================================================
  // YEAR 1
  // ==========================================================================
  {
    id: 'first-year',
    yearNumber: 1,
    displayNumber: '01',
    title: 'FIRST YEAR',
    description: 'Build your foundation.',
    status: 'RESOURCES AVAILABLE',
    semesters: [
      {
        id: 'sem-1',
        number: 1,
        title: 'SEMESTER I',
        shortTitle: 'SEM 1',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y1-s1-math1',
            name: 'ENGINEERING MATHEMATICS - I',
            code: '22MA101BS',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_maths1_notes_placeholder',
            description: 'Matrices, Calculus, Sequences, and Differential Equations.',
            categoryTags: ['Lecture Notes', 'Previous Papers', 'Question Bank'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s1-pps',
            name: 'PROGRAMMING FOR PROBLEM SOLVING',
            code: '22CS101ES',
            departments: ['COMMON', 'DS', 'CSE', 'AIML'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_pps_c_prog_placeholder',
            description: 'Introduction to C Programming, Control Structures, Arrays, and Pointers.',
            categoryTags: ['Lecture Notes', 'Lab Manual', 'Code Examples'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s1-chem',
            name: 'ENGINEERING CHEMISTRY',
            code: '22CH101BS',
            departments: ['COMMON', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_chem_materials_placeholder',
            description: 'Molecular Structure, Water Technology, Battery Chemistry, and Polymers.',
            categoryTags: ['Lecture Notes', 'Formulas', 'Previous Papers'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s1-bee',
            name: 'BASIC ELECTRICAL ENGINEERING',
            code: '22EE101ES',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_bee_electrical_placeholder',
            description: 'DC & AC Circuits, Transformers, Electrical Machines, and Safety.',
            categoryTags: ['Lecture Notes', 'Handwritten Notes', 'Diagrams'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s1-graphics',
            name: 'ENGINEERING GRAPHICS',
            code: '22ME101ES',
            departments: ['COMMON', 'MECHANICAL', 'CIVIL', 'ECE'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_engg_graphics_placeholder',
            description: 'Orthographic Projections, Isometric Views, Conic Sections, and CAD basics.',
            categoryTags: ['Drawing Sheets', 'Solved Problems', 'CAD Guides'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s1-pps-lab',
            name: 'PROGRAMMING FOR PROBLEM SOLVING LAB',
            code: '22CS102ES',
            departments: ['COMMON', 'DS', 'CSE', 'AIML'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_pps_lab_manual_placeholder',
            description: 'Hands-on C programming lab programs, viva questions and test cases.',
            categoryTags: ['Lab Manual', 'Solved Codes', 'Viva Questions'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s1-chem-lab',
            name: 'ENGINEERING CHEMISTRY LAB',
            code: '22CH102BS',
            departments: ['COMMON', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_chem_lab_placeholder',
            description: 'Titration, Conductometry, Viscosity, and hardness determination experiments.',
            categoryTags: ['Lab Manual', 'Observations', 'Viva Prep'],
            semesterId: 'sem-1',
            semesterTitle: 'SEMESTER I',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          }
        ]
      },
      {
        id: 'sem-2',
        number: 2,
        title: 'SEMESTER II',
        shortTitle: 'SEM 2',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y1-s2-math2',
            name: 'ENGINEERING MATHEMATICS - II',
            code: '22MA201BS',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_maths2_notes_placeholder',
            description: 'Vector Calculus, Multiple Integrals, and Laplace Transforms.',
            categoryTags: ['Lecture Notes', 'Formula Sheet', 'Previous Papers'],
            semesterId: 'sem-2',
            semesterTitle: 'SEMESTER II',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s2-physics',
            name: 'APPLIED PHYSICS',
            code: '22PH201BS',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_physics_notes_placeholder',
            description: 'Quantum Mechanics, Lasers, Fiber Optics, and Semiconductor Physics.',
            categoryTags: ['Lecture Notes', 'Diagrams', 'Question Bank'],
            semesterId: 'sem-2',
            semesterTitle: 'SEMESTER II',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s2-ds',
            name: 'DATA STRUCTURES',
            code: '22CS201ES',
            departments: ['COMMON', 'DS', 'CSE', 'AIML'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_datastructures_placeholder',
            description: 'Stacks, Queues, Linked Lists, Trees, Graphs, Sorting & Searching Algorithms.',
            categoryTags: ['Lecture Notes', 'Algorithms', 'Cheat Sheets'],
            semesterId: 'sem-2',
            semesterTitle: 'SEMESTER II',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s2-english',
            name: 'ENGLISH FOR SKILL ENHANCEMENT',
            code: '22HS201HS',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_english_comm_placeholder',
            description: 'Technical Writing, Business Communication, Vocabulary, and Comprehension.',
            categoryTags: ['Study Material', 'Writing Samples', 'Grammar'],
            semesterId: 'sem-2',
            semesterTitle: 'SEMESTER II',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s2-physics-lab',
            name: 'APPLIED PHYSICS LAB',
            code: '22PH202BS',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_physics_lab_placeholder',
            description: 'Laser diffraction, Energy band gap, Spectrometer, and Newton Rings experiments.',
            categoryTags: ['Lab Manual', 'Readings Sheet', 'Viva Questions'],
            semesterId: 'sem-2',
            semesterTitle: 'SEMESTER II',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          },
          {
            id: 'y1-s2-ds-lab',
            name: 'DATA STRUCTURES LAB',
            code: '22CS202ES',
            departments: ['COMMON', 'DS', 'CSE', 'AIML'],
            status: 'RESOURCES AVAILABLE',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_ds_lab_manual_placeholder',
            description: 'Practical implementation of stacks, queues, binary search trees and graph traversal.',
            categoryTags: ['Lab Manual', 'Source Codes', 'Viva Prep'],
            semesterId: 'sem-2',
            semesterTitle: 'SEMESTER II',
            yearId: 'first-year',
            yearTitle: 'FIRST YEAR'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // YEAR 2
  // ==========================================================================
  {
    id: 'second-year',
    yearNumber: 2,
    displayNumber: '02',
    title: 'SECOND YEAR',
    description: 'Explore your core subjects.',
    status: 'COMING SOON',
    semesters: [
      {
        id: 'sem-3',
        number: 3,
        title: 'SEMESTER I (3RD SEM)',
        shortTitle: 'SEM 3',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y2-s1-discrete',
            name: 'DISCRETE MATHEMATICS',
            code: '22CS301PC',
            departments: ['COMMON', 'DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_discrete_math_placeholder',
            description: 'Mathematical logic, Set theory, Relations, Graph theory, and Combinatorics.',
            categoryTags: ['Lecture Notes', 'Proof Guides'],
            semesterId: 'sem-3',
            semesterTitle: 'SEMESTER I (3RD SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s1-dco',
            name: 'DIGITAL LOGIC & COMPUTER ORGANIZATION',
            code: '22CS302PC',
            departments: ['DS', 'CSE', 'AIML', 'ECE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_dco_notes_placeholder',
            description: 'Boolean algebra, Karnaugh maps, CPU design, Memory hierarchy, and I/O.',
            categoryTags: ['Lecture Notes', 'Circuits'],
            semesterId: 'sem-3',
            semesterTitle: 'SEMESTER I (3RD SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s1-java',
            name: 'OBJECT ORIENTED PROGRAMMING VIA JAVA',
            code: '22CS303PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_java_oop_placeholder',
            description: 'OOP concepts, Exception handling, Multithreading, Streams, and Swing/AWT.',
            categoryTags: ['Notes', 'Code Repos', 'Lab Manual'],
            semesterId: 'sem-3',
            semesterTitle: 'SEMESTER I (3RD SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s1-dbms',
            name: 'DATABASE MANAGEMENT SYSTEMS',
            code: '22CS304PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_dbms_notes_placeholder',
            description: 'Relational model, SQL queries, Normalization, Transactions, and Indexing.',
            categoryTags: ['Lecture Notes', 'SQL Cheat Sheets'],
            semesterId: 'sem-3',
            semesterTitle: 'SEMESTER I (3RD SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s1-edc',
            name: 'ELECTRONIC DEVICES & CIRCUITS',
            code: '22EC301PC',
            departments: ['ECE', 'EEE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_edc_placeholder',
            description: 'PN Junction diodes, BJT, MOSFET characteristics, and Small Signal Amplifiers.',
            categoryTags: ['Circuits', 'Notes', 'Lab Manual'],
            semesterId: 'sem-3',
            semesterTitle: 'SEMESTER I (3RD SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s1-mos',
            name: 'MECHANICS OF SOLIDS',
            code: '22ME301PC',
            departments: ['MECHANICAL', 'CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_mos_placeholder',
            description: 'Simple stresses, Bending moments, Shear stress distribution, and Deflection of beams.',
            categoryTags: ['Formulas', 'Solved Problems'],
            semesterId: 'sem-3',
            semesterTitle: 'SEMESTER I (3RD SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          }
        ]
      },
      {
        id: 'sem-4',
        number: 4,
        title: 'SEMESTER II (4TH SEM)',
        shortTitle: 'SEM 4',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y2-s2-daa',
            name: 'DESIGN & ANALYSIS OF ALGORITHMS',
            code: '22CS401PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_daa_notes_placeholder',
            description: 'Divide and conquer, Greedy method, Dynamic programming, and NP-completeness.',
            categoryTags: ['Lecture Notes', 'Algorithm Traces'],
            semesterId: 'sem-4',
            semesterTitle: 'SEMESTER II (4TH SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s2-os',
            name: 'OPERATING SYSTEMS',
            code: '22CS402PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_os_notes_placeholder',
            description: 'Processes, Threads, CPU scheduling, Synchronization, Deadlocks, Virtual memory.',
            categoryTags: ['Lecture Notes', 'Previous Papers'],
            semesterId: 'sem-4',
            semesterTitle: 'SEMESTER II (4TH SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s2-flat',
            name: 'FORMAL LANGUAGES & AUTOMATA THEORY',
            code: '22CS403PC',
            departments: ['CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_flat_notes_placeholder',
            description: 'DFA, NFA, Regular expressions, Context-Free Grammars, and Turing Machines.',
            categoryTags: ['Lecture Notes', 'State Diagrams'],
            semesterId: 'sem-4',
            semesterTitle: 'SEMESTER II (4TH SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s2-se',
            name: 'SOFTWARE ENGINEERING',
            code: '22CS404PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_se_notes_placeholder',
            description: 'Software development life cycles, Agile, Requirements engineering, and Testing.',
            categoryTags: ['Lecture Notes', 'UML Diagrams'],
            semesterId: 'sem-4',
            semesterTitle: 'SEMESTER II (4TH SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s2-signals',
            name: 'SIGNALS & SYSTEMS',
            code: '22EC401PC',
            departments: ['ECE', 'EEE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_signals_placeholder',
            description: 'Continuous & discrete time signals, Fourier transform, and Z-transforms.',
            categoryTags: ['Lecture Notes', 'Solved Problems'],
            semesterId: 'sem-4',
            semesterTitle: 'SEMESTER II (4TH SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          },
          {
            id: 'y2-s2-fluid',
            name: 'FLUID MECHANICS & HYDRAULIC MACHINERY',
            code: '22ME401PC',
            departments: ['MECHANICAL', 'CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_fluid_placeholder',
            description: 'Fluid properties, Bernoulli equation, Turbines, Pumps, and Dimensional analysis.',
            categoryTags: ['Formulas', 'Lab Guides'],
            semesterId: 'sem-4',
            semesterTitle: 'SEMESTER II (4TH SEM)',
            yearId: 'second-year',
            yearTitle: 'SECOND YEAR'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // YEAR 3
  // ==========================================================================
  {
    id: 'third-year',
    yearNumber: 3,
    displayNumber: '03',
    title: 'THIRD YEAR',
    description: 'Deepen your knowledge.',
    status: 'COMING SOON',
    semesters: [
      {
        id: 'sem-5',
        number: 5,
        title: 'SEMESTER I (5TH SEM)',
        shortTitle: 'SEM 5',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y3-s1-cn',
            name: 'COMPUTER NETWORKS',
            code: '22CS501PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_cn_notes_placeholder',
            description: 'OSI & TCP/IP models, Data link layer protocols, Routing algorithms, and Sockets.',
            categoryTags: ['Lecture Notes', 'Packet Analysis'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s1-webtech',
            name: 'WEB TECHNOLOGIES',
            code: '22CS502PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_webtech_placeholder',
            description: 'HTML5, CSS3, JavaScript, Servlets, JSP, Node.js, and REST APIs.',
            categoryTags: ['Lecture Notes', 'Code Samples'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s1-cd',
            name: 'COMPILER DESIGN',
            code: '22CS503PC',
            departments: ['CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_compiler_design_placeholder',
            description: 'Lexical analysis, Parsers (LL, LR, LALR), Syntax-directed translation, Code generation.',
            categoryTags: ['Lecture Notes', 'Parsing Tables'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s1-aiml',
            name: 'ARTIFICIAL INTELLIGENCE & MACHINE LEARNING',
            code: '22CS504PC',
            departments: ['COMMON', 'DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_aiml_placeholder',
            description: 'Search algorithms, Supervised learning, Neural networks, and Model evaluation.',
            categoryTags: ['Lecture Notes', 'Notebooks'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s1-vlsi',
            name: 'VLSI DESIGN',
            code: '22EC501PC',
            departments: ['ECE', 'EEE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_vlsi_placeholder',
            description: 'CMOS logic, Layout rules, Verilog HDL synthesis, and FPGA architectures.',
            categoryTags: ['Verilog Code', 'Circuits'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s1-dme',
            name: 'DESIGN OF MACHINE ELEMENTS',
            code: '22ME501PC',
            departments: ['MECHANICAL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_dme_placeholder',
            description: 'Design against static and fluctuating loads, Shafts, Keys, and Couplings.',
            categoryTags: ['Design Data Handbooks', 'Notes'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s1-geotech',
            name: 'GEOTECHNICAL ENGINEERING',
            code: '22CE501PC',
            departments: ['CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_geotech_placeholder',
            description: 'Soil classification, Permeability, Compaction, and Consolidation theories.',
            categoryTags: ['Lab Manual', 'Theory Notes'],
            semesterId: 'sem-5',
            semesterTitle: 'SEMESTER I (5TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          }
        ]
      },
      {
        id: 'sem-6',
        number: 6,
        title: 'SEMESTER II (6TH SEM)',
        shortTitle: 'SEM 6',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y3-s2-cc',
            name: 'CLOUD COMPUTING',
            code: '22CS601PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_cloud_notes_placeholder',
            description: 'Cloud service models (IaaS, PaaS, SaaS), Virtualization, AWS/GCP architectures.',
            categoryTags: ['Lecture Notes', 'Case Studies'],
            semesterId: 'sem-6',
            semesterTitle: 'SEMESTER II (6TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s2-cns',
            name: 'CRYPTOGRAPHY & NETWORK SECURITY',
            code: '22CS602PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_cryptography_placeholder',
            description: 'Symmetric & asymmetric encryption, RSA, Hash functions, Digital signatures.',
            categoryTags: ['Lecture Notes', 'Crypto Math'],
            semesterId: 'sem-6',
            semesterTitle: 'SEMESTER II (6TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s2-iot',
            name: 'INTERNET OF THINGS (IoT)',
            code: '22CS603PC',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_iot_notes_placeholder',
            description: 'Sensors, Actuators, Raspberry Pi/Arduino, MQTT protocols, and IoT analytics.',
            categoryTags: ['Lecture Notes', 'Project Ideas'],
            semesterId: 'sem-6',
            semesterTitle: 'SEMESTER II (6TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s2-bda',
            name: 'BIG DATA ANALYTICS',
            code: '22DS601PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_bda_placeholder',
            description: 'Hadoop ecosystem, MapReduce, Spark streaming, and NoSQL databases.',
            categoryTags: ['Lecture Notes', 'Notebooks'],
            semesterId: 'sem-6',
            semesterTitle: 'SEMESTER II (6TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s2-dsp',
            name: 'DIGITAL SIGNAL PROCESSING',
            code: '22EC601PC',
            departments: ['ECE', 'EEE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_dsp_placeholder',
            description: 'DFT, FFT algorithms, IIR and FIR digital filter structures and design.',
            categoryTags: ['Filter Design', 'MATLAB codes'],
            semesterId: 'sem-6',
            semesterTitle: 'SEMESTER II (6TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          },
          {
            id: 'y3-s2-transport',
            name: 'TRANSPORTATION ENGINEERING',
            code: '22CE601PC',
            departments: ['CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_transport_placeholder',
            description: 'Highway geometric design, Traffic engineering, Pavement design, and Materials.',
            categoryTags: ['Design Standards', 'Notes'],
            semesterId: 'sem-6',
            semesterTitle: 'SEMESTER II (6TH SEM)',
            yearId: 'third-year',
            yearTitle: 'THIRD YEAR'
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // YEAR 4
  // ==========================================================================
  {
    id: 'fourth-year',
    yearNumber: 4,
    displayNumber: '04',
    title: 'FOURTH YEAR',
    description: 'Prepare for what\'s next.',
    status: 'COMING SOON',
    semesters: [
      {
        id: 'sem-7',
        number: 7,
        title: 'SEMESTER I (7TH SEM)',
        shortTitle: 'SEM 7',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y4-s1-dl',
            name: 'DEEP LEARNING',
            code: '22CS701PC',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_deep_learning_placeholder',
            description: 'Convolutional neural networks, RNNs, LSTMs, Transformers, and PyTorch.',
            categoryTags: ['Lecture Notes', 'Research Papers'],
            semesterId: 'sem-7',
            semesterTitle: 'SEMESTER I (7TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s1-nlp',
            name: 'NATURAL LANGUAGE PROCESSING',
            code: '22CS702PE',
            departments: ['DS', 'AIML', 'CSE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_nlp_notes_placeholder',
            description: 'Tokenization, Embeddings, Language modeling, Attention mechanisms, and LLMs.',
            categoryTags: ['Lecture Notes', 'Lab Guides'],
            semesterId: 'sem-7',
            semesterTitle: 'SEMESTER I (7TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s1-embedded',
            name: 'EMBEDDED SYSTEMS DESIGN',
            code: '22EC701PC',
            departments: ['ECE', 'EEE', 'CSE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_embedded_placeholder',
            description: 'ARM Cortex architecture, RTOS, Peripheral interfacing, and Firmware debugging.',
            categoryTags: ['ARM Architecture', 'Lab Codes'],
            semesterId: 'sem-7',
            semesterTitle: 'SEMESTER I (7TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s1-cadcam',
            name: 'CAD / CAM & ROBOTICS',
            code: '22ME701PC',
            departments: ['MECHANICAL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_cadcam_placeholder',
            description: 'Geometric modeling, CNC part programming, and Industrial robot kinematics.',
            categoryTags: ['CNC Programs', 'CAD Notes'],
            semesterId: 'sem-7',
            semesterTitle: 'SEMESTER I (7TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s1-env',
            name: 'ENVIRONMENTAL ENGINEERING',
            code: '22CE701PC',
            departments: ['CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_enviro_placeholder',
            description: 'Water quality standards, Treatment plants, Air pollution control, and Solid waste.',
            categoryTags: ['Field Standards', 'Design Manuals'],
            semesterId: 'sem-7',
            semesterTitle: 'SEMESTER I (7TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s1-proj1',
            name: 'MAJOR PROJECT PHASE - I',
            code: '22CS703PW',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_project_phase1_placeholder',
            description: 'Project proposal templates, Literature survey formats, and IEEE papers guide.',
            categoryTags: ['Report Templates', 'Synopsis Formats'],
            semesterId: 'sem-7',
            semesterTitle: 'SEMESTER I (7TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          }
        ]
      },
      {
        id: 'sem-8',
        number: 8,
        title: 'SEMESTER II (8TH SEM)',
        shortTitle: 'SEM 8',
        description: 'Explore your subjects and resources.',
        subjects: [
          {
            id: 'y4-s2-cyber',
            name: 'CYBER FORENSICS & ETHICAL HACKING',
            code: '22CS801PE',
            departments: ['DS', 'CSE', 'AIML'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_cyber_forensics_placeholder',
            description: 'Digital evidence, Disk imaging, Memory forensics, and Penetration testing.',
            categoryTags: ['Lecture Notes', 'Tool Guides'],
            semesterId: 'sem-8',
            semesterTitle: 'SEMESTER II (8TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s2-automation',
            name: 'INDUSTRIAL AUTOMATION & PLC',
            code: '22EE801PE',
            departments: ['EEE', 'MECHANICAL', 'ECE'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_plc_placeholder',
            description: 'SCADA systems, PLC ladder logic programming, Sensors, and Actuators.',
            categoryTags: ['Ladder Logic', 'Automation Guides'],
            semesterId: 'sem-8',
            semesterTitle: 'SEMESTER II (8TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s2-estimation',
            name: 'CONSTRUCTION MANAGEMENT & ESTIMATION',
            code: '22CE801PE',
            departments: ['CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_estimation_placeholder',
            description: 'Rate analysis, Quantity surveying, Contracts, Tenders, and Project scheduling.',
            categoryTags: ['Valuation Sheets', 'Templates'],
            semesterId: 'sem-8',
            semesterTitle: 'SEMESTER II (8TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          },
          {
            id: 'y4-s2-proj2',
            name: 'MAJOR PROJECT PHASE - II & VIVA VOCE',
            code: '22CS802PW',
            departments: ['COMMON', 'DS', 'CSE', 'AIML', 'ECE', 'EEE', 'MECHANICAL', 'CIVIL'],
            status: 'COMING SOON',
            driveUrl: 'https://drive.google.com/drive/folders/1_snist_project_phase2_placeholder',
            description: 'Final thesis formatting guidelines, Presentation decks, and Viva preparation.',
            categoryTags: ['Report Templates', 'Viva Prep'],
            semesterId: 'sem-8',
            semesterTitle: 'SEMESTER II (8TH SEM)',
            yearId: 'fourth-year',
            yearTitle: 'FOURTH YEAR'
          }
        ]
      }
    ]
  }
];

/**
 * ----------------------------------------------------------------------------
 * UTILITY & FILTERING HELPERS
 * ----------------------------------------------------------------------------
 */

/**
 * Dynamically constructs the AcademicYear[] hierarchy from a database-provided
 * flat list of subjects. Ensures that changes made in the Admin Dashboard
 * dynamically reflect across Years, Semesters, Department filters, and Search.
 */
export function buildAcademicYearsFromSubjects(allSubjects: Subject[]): AcademicYear[] {
  const yearsTemplate: {
    id: string;
    yearNumber: number;
    displayNumber: string;
    title: string;
    description: string;
    semesters: { id: string; number: number; title: string; shortTitle: string; description: string }[];
  }[] = [
    {
      id: 'first-year',
      yearNumber: 1,
      displayNumber: '01',
      title: 'FIRST YEAR',
      description: 'Build your foundation.',
      semesters: [
        { id: 'sem-1', number: 1, title: 'SEMESTER I', shortTitle: 'SEM 1', description: 'Explore your subjects and resources.' },
        { id: 'sem-2', number: 2, title: 'SEMESTER II', shortTitle: 'SEM 2', description: 'Explore your subjects and resources.' },
      ],
    },
    {
      id: 'second-year',
      yearNumber: 2,
      displayNumber: '02',
      title: 'SECOND YEAR',
      description: 'Explore your core subjects.',
      semesters: [
        { id: 'sem-1', number: 1, title: 'SEMESTER I', shortTitle: 'SEM 1', description: 'Explore your subjects and resources.' },
        { id: 'sem-2', number: 2, title: 'SEMESTER II', shortTitle: 'SEM 2', description: 'Explore your subjects and resources.' },
      ],
    },
    {
      id: 'third-year',
      yearNumber: 3,
      displayNumber: '03',
      title: 'THIRD YEAR',
      description: 'Deepen your knowledge.',
      semesters: [
        { id: 'sem-1', number: 1, title: 'SEMESTER I', shortTitle: 'SEM 1', description: 'Explore your subjects and resources.' },
        { id: 'sem-2', number: 2, title: 'SEMESTER II', shortTitle: 'SEM 2', description: 'Explore your subjects and resources.' },
      ],
    },
    {
      id: 'fourth-year',
      yearNumber: 4,
      displayNumber: '04',
      title: 'FOURTH YEAR',
      description: "Prepare for what's next.",
      semesters: [
        { id: 'sem-1', number: 1, title: 'SEMESTER I', shortTitle: 'SEM 1', description: 'Explore your subjects and resources.' },
        { id: 'sem-2', number: 2, title: 'SEMESTER II', shortTitle: 'SEM 2', description: 'Explore your subjects and resources.' },
      ],
    },
  ];

  return yearsTemplate.map((yt) => {
    const yearSubjects = allSubjects.filter((s) => s.yearId === yt.id);

    const builtSemesters = yt.semesters.map((st) => {
      const semSubjects = yearSubjects.filter((s) => {
        if (s.semesterId === st.id) return true;
        // Also support legacy sem-3, sem-4, etc.
        if (st.id === 'sem-1' && (s.semesterId === 'sem-3' || s.semesterId === 'sem-5' || s.semesterId === 'sem-7')) return true;
        if (st.id === 'sem-2' && (s.semesterId === 'sem-4' || s.semesterId === 'sem-6' || s.semesterId === 'sem-8')) return true;
        return false;
      });

      return {
        id: st.id,
        number: st.number,
        title: st.title,
        shortTitle: st.shortTitle,
        description: st.description,
        subjects: semSubjects,
      };
    });

    const hasAvailable = yearSubjects.some((s) => s.status === 'RESOURCES AVAILABLE');

    return {
      id: yt.id,
      yearNumber: yt.yearNumber,
      displayNumber: yt.displayNumber,
      title: yt.title,
      description: yt.description,
      status: hasAvailable ? 'RESOURCES AVAILABLE' : 'COMING SOON',
      semesters: builtSemesters,
    };
  });
}

/**
 * Returns a flat list of all subjects across all years and semesters.
 */
export function getAllSubjects(): Subject[] {
  const all: Subject[] = [];
  for (const year of ACADEMIC_YEARS) {
    for (const sem of year.semesters) {
      all.push(...sem.subjects);
    }
  }
  return all;
}

/**
 * Filters a list of subjects by selected department.
 * - When 'ALL' is selected: returns all subjects for that semester.
 * - When 'COMMON' is selected: returns subjects tagged 'COMMON'.
 * - When a specific department (e.g. 'DS', 'CSE') is selected:
 *   returns subjects relevant to that department AND common subjects.
 */
export function filterSubjectsByDepartment(
  subjects: Subject[],
  selectedDeptId: string
): Subject[] {
  if (!selectedDeptId || selectedDeptId === 'ALL') {
    return subjects;
  }

  const normalized = selectedDeptId.toUpperCase().trim();

  if (normalized === 'COMMON') {
    return subjects.filter((subject) =>
      subject.departments.some((d) => d.toUpperCase() === 'COMMON')
    );
  }

  return subjects.filter((subject) =>
    subject.departments.some((d) => {
      const dept = d.toUpperCase().trim();
      return dept === normalized || dept === 'COMMON';
    })
  );
}

/**
 * Searches subjects by:
 * - Subject Name (case-insensitive)
 * - Subject Code (e.g. '22MA101BS')
 * - Department (e.g. 'DS', 'CSE', 'COMMON', 'DATA SCIENCE')
 * - Description & tags
 *
 * Can also be combined with an active department filter.
 */
export function searchSubjects(
  subjects: Subject[],
  query: string,
  departmentFilter: string = 'ALL'
): Subject[] {
  // First apply department filter
  const baseFiltered = filterSubjectsByDepartment(subjects, departmentFilter);

  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    return baseFiltered;
  }

  return baseFiltered.filter((subject) => {
    // 1. Check subject name
    if (subject.name.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // 2. Check subject code
    if (subject.code && subject.code.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // 3. Check departments list (both short codes e.g. 'DS' and full names e.g. 'Data Science')
    const matchesDept = subject.departments.some((d) => {
      const deptUpper = d.toUpperCase();
      if (deptUpper.toLowerCase().includes(cleanQuery)) return true;

      const foundConfig = DEPARTMENTS_LIST.find(
        (cfg) => cfg.id.toUpperCase() === deptUpper
      );
      if (foundConfig && foundConfig.fullName.toLowerCase().includes(cleanQuery)) {
        return true;
      }
      return false;
    });
    if (matchesDept) return true;

    // 4. Check description & tags
    if (subject.description && subject.description.toLowerCase().includes(cleanQuery)) {
      return true;
    }
    if (
      subject.categoryTags &&
      subject.categoryTags.some((tag) => tag.toLowerCase().includes(cleanQuery))
    ) {
      return true;
    }

    return false;
  });
}
