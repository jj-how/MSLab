import { LabFullData } from '../types';
import { initialPublicationsData } from './publicationsData';
import { initialProjectsData } from './projectsData';

export const initialLabData: LabFullData = {
  lab: {
    labNameKo: '다변량통계분석 연구실',
    labNameEn: 'Multivariate Statistical Analysis Laboratory',
    shortName: 'MS Lab',
    logoUrl: 'MSL.png',
    mottoKo: '빅데이터와 인공지능 기술로 데이터 속 숨겨진 통찰과 가치를 창출합니다',
    mottoEn: 'Unlocking Insights and Value through Big Data & Intelligent Statistical Modeling',
    descriptionKo: '본 연구실은 의료 바이오인포매틱스 딥러닝 예후 예측, 기상 및 농업 시계열 데이터 마이닝, 생체 신호(ECG) 패턴 인식, 비선형 회귀 모형 및 빅데이터 분석을 핵심 연구 분야로 삼아 학술적 깊이와 실용적 혁신을 선도합니다.',
    descriptionEn: 'Our laboratory focuses on Medical AI & Bioinformatics (PET deep learning prognosis prediction, cancer/stroke survival modeling), Time-series Data Mining, and Biomedical Signal Pattern Recognition.',
    universityKo: '전남대학교',
    universityEn: 'Chonnam National University',
    departmentKo: '자연과학대학 통계학과 / 빅데이터융합학과',
    departmentEn: 'Department of Statistics / Dept. of Big Data Convergence',
    buildingKo: '자연과학대학 1호관',
    buildingEn: 'Natural Sciences Bldg #1',
    roomKo: '239호 다변량통계분석연구실',
    roomEn: 'Room 239, MSA Lab',
    addressKo: '전남광주 북구 용봉로 77 자연과학대학 1호관 239호 다변량통계분석연구실',
    addressEn: 'Room 239, Natural Sciences Bldg #1, 77 Yongbong-ro, Buk-gu, Gwangju, Republic of Korea',
    establishedYear: 2007,
    contactEmail: 'kimms@chonnam.ac.kr',
    contactPhone: '+82-62-530-3441',
    socialLinks: {},
    stats: {
      publicationsCount: 69,
      activeProjectsCount: 5,
      totalGrants: '28억원+',
      currentMembersCount: 8,
      alumniCount: 38
    }
  },
  professor: {
    nameKo: '김민수 교수',
    nameEn: 'Prof. Min-Soo Kim',
    titleKo: '교수 / 연구책임자 (PI)',
    titleEn: 'Professor & Principal Investigator',
    departmentKo: '전남대학교 자연과학대학 통계학과 / 빅데이터융합학과',
    departmentEn: 'Dept. of Statistics, Chonnam National University',
    universityKo: '전남대학교',
    universityEn: 'Chonnam National University',
    email: 'kimms@chonnam.ac.kr',
    phone: '+82-62-530-3441',
    officeKo: '자연과학대학 1호관 201호',
    officeEn: 'Natural Sciences Bldg #1, Dept. of Statistics',
    avatarUrl: '/professor.jpg',
    bioKo: `전남대학교 통계학과 교수로서 현재 전남대학교 교수회장, 전남대학교 교수평의회 의장, 대학평의원회 의장이다. 자연과학대학 학장(2022.08~2024.07), 국립대학자연과학대학장 협의회 부회장(2023), 빅데이터기반 과학인재양성사업단(CK-I) 단장 및 산학협력단 빅데이터센터장을 역임하였다.

카이스트(KAIST) 정보전자연구소 연구원, 카이스트 인공지능패턴인식 연구실(AIPR Lab) 연구원 및 신용보증기금(KODIT) 경영전략실 전문위원을 거쳤으며, 전남대학교에 임용된 이후 전남대학교 입학본부장, 제39대 교수회 수석부회장, 제17대 평의원회 기획이사 등을 역임하며 학술 발전과 대학 혁신에 기여해 왔다.

현재 한국데이터정보과학회 부회장, 한국자료분석학회지 편집위원, 광주광역시 선거여론조사심의위원회 위원으로 활동하고 있으며, 의료 영상(PET) 기반 딥러닝 예후 예측 모형, 뇌졸중 및 암 환자 생존분석, 기상·토양 데이터 마이닝 및 시계열 농업 기상 예측, 다중 레이블 생체 신호(ECG) 딥러닝 분류 등 첨단 인공지능과 응용통계 융합 연구를 활발히 선도하고 있다.`,
    bioEn: `Dr. Min-Soo Kim is a Professor in the Department of Statistics and Department of Big Data Convergence at Chonnam National University. He formerly served as the Dean of the College of Natural Sciences (2022–2024), Vice President of the National Universities Deans of Natural Sciences Association (2023), Director of the CK-I Big Data Science Talent Development Project, and Director of the Big Data Center at the JNU Industry-Academic Cooperation Foundation.

Prior to his professorship, he was a Postdoctoral Researcher at KAIST Information & Electronics Research Institute, a Visiting Researcher at the KAIST AI & Pattern Recognition Lab (AIPR Lab), and a Senior Professional Member of the Corporate Strategy Office at Korea Credit Guarantee Fund (KODIT).

He currently serves as Vice President of the Korean Data & Information Science Society and Editorial Board Member of the Journal of the Korean Data Analysis Society. His core research spans Medical AI & Bioinformatics (PET deep learning prognosis prediction, cancer/stroke survival modeling), Time-series Data Mining (meteorological impact & agricultural yield/price forecasting), and Deep Neural Network-based Biomedical Signal Classification.`,
    messageKo: `데이터는 현대 과학과 산업의 가장 강력한 언어입니다.

우리 연구실은 통계학의 탄탄한 수학적 이론 기반 위에 최신 딥러닝 및 머신러닝 기술을 결합하여, 의료·보건·농업·기상 등 실생활의 복잡한 난제를 해결하는 실용적 연구를 지향합니다.

호기심과 열정을 가지고 데이터 속에 담긴 새로운 통찰을 함께 발굴해 나갈 학생들을 언제나 환영합니다.`,
    messageEn: `Data is the most powerful language of modern science and industry.

Our laboratory combines theoretical rigor in statistical learning with state-of-the-art deep learning models to address critical challenges across healthcare, agriculture, and meteorological forecasting.

We warmly welcome aspiring researchers who are passionate about discovering hidden knowledge in complex data.`,
    education: [
      {
        year: '1998 - 2003',
        degree: '이학박사 (Ph.D. in Statistics)',
        institution: '통계학 및 인공지능/패턴인식 전공',
        details: '통계적 학습 이론 및 기계학습 패턴인식'
      },
      {
        year: '1996 - 1998',
        degree: '이학석사 (M.S. in Statistics)',
        institution: '응용통계 및 데이터마이닝',
        details: '시계열 분석 및 통계 모형화'
      },
      {
        year: '1991 - 1996',
        degree: '이학사 (B.S. in Statistics)',
        institution: '전남대학교 자연과학대학 통계학과',
        details: '육군 만기전역 (1991.12 ~ 1993.05)'
      }
    ],
    experience: [
      {
        period: '2025.09 - 현재',
        role: '회장',
        institution: '전남대학교 교수회'
      },
      {
        period: '2025.09 - 현재',
        role: '의장',
        institution: '전남대학교 교수평의회'
      },
      {
        period: '2025.09 - 현재',
        role: '의장',
        institution: '전남대학교 대학평의원회'
      },
      {
        period: '2007.02 - 현재',
        role: '교수 (Professor)',
        institution: '전남대학교 자연과학대학 통계학과'
      },
      {
        period: '2025.01 - 현재',
        role: '부회장',
        institution: '한국데이터정보과학회'
      },
      {
        period: '2022.08 - 2024.07',
        role: '학장 (Dean)',
        institution: '전남대학교 자연과학대학'
      },
      {
        period: '2023.01 - 2023.12',
        role: '부회장',
        institution: '국립대학자연과학대학장 협의회'
      },
      {
        period: '2022.01 - 현재',
        role: '편집위원',
        institution: '한국자료분석학회지'
      },
      {
        period: '2022.01 - 2023.12',
        role: '지역이사',
        institution: '한국자료분석학회'
      },
      {
        period: '2021.03 - 2023.02',
        role: '학과장',
        institution: '전남대학교 빅데이터융합학과'
      },
      {
        period: '2021.09 - 2023.08',
        role: '위원',
        institution: '전라남도 정보화위원회'
      },
      {
        period: '2020.03 - 현재',
        role: '위원',
        institution: '광주광역시 선거여론조사심의위원회'
      },
      {
        period: '2018.07 - 2019.08',
        role: '수석부회장',
        institution: '전남대학교 제39대 교수회'
      },
      {
        period: '2017.09 - 2018.07',
        role: '기획이사',
        institution: '전남대학교 제17대 평의원회'
      },
      {
        period: '2017.01 - 2019.02',
        role: '센터장',
        institution: '전남대학교 산학협력단 빅데이터센터'
      },
      {
        period: '2015.01 - 2024.12',
        role: '편집위원',
        institution: '한국데이터정보과학회지'
      },
      {
        period: '2014.09 - 2019.02',
        role: '사업단장',
        institution: '전남대학교 CK-I 사업단 (빅데이터기반 과학인재양성사업단)'
      },
      {
        period: '2014.03 - 2016.02',
        role: '학과장',
        institution: '전남대학교 통계학과'
      },
      {
        period: '2012.09 - 2013.01',
        role: '본부장',
        institution: '전남대학교 입학본부'
      },
      {
        period: '2010.06 - 2013.01',
        role: '실장',
        institution: '전남대학교 입학본부 입학전형실'
      },
      {
        period: '2005.08 - 2007.02',
        role: '전문위원',
        institution: '신용보증기금(KODIT) 경영전략실'
      },
      {
        period: '2005.03 - 2005.08',
        role: '위촉연구원',
        institution: '카이스트(KAIST) 인공지능패턴인식 연구실(AIPR Lab.)'
      },
      {
        period: '2003.03 - 2005.02',
        role: '박사후연구원',
        institution: '카이스트(KAIST) 정보전자연구소'
      }
    ],
    awards: [
      {
        year: '2024.01.26',
        title: '학술상 (Best Academic Award)',
        organization: '한국자료분석학회'
      },
      {
        year: '2021.06.08',
        title: '봉사우수 표창',
        organization: '전남대학교 총장'
      },
      {
        year: '2019.06.05',
        title: '봉사우수 표창',
        organization: '전남대학교 총장'
      },
      {
        year: '2018.06.08',
        title: '교육우수교수상 (Best Teaching Award)',
        organization: '전남대학교 총장'
      },
      {
        year: '2017.06.08',
        title: '근속상 (10년 근속)',
        organization: '전남대학교 총장'
      }
    ],
    academicServices: [
      '한국데이터정보과학회 부회장 (2025.01 - 현재)',
      '한국자료분석학회지 편집위원 (2022.01 - 현재)',
      '광주광역시 선거여론조사심의위원회 위원 (2020.03 - 현재)',
      '전남대학교 자연과학대학 학장 (2022.08 - 2024.07)',
      '국립대학자연과학대학장 협의회 부회장 (2023.01 - 2023.12)',
      '전라남도 정보화위원회 위원 (2021.09 - 2023.08)',
      '한국데이터정보과학회지 편집위원 (2015.01 - 2024.12)',
      '한국자료분석학회 지역이사 (2022.01 - 2023.12)'
    ],
    links: {
      scholar: '',
      github: '',
      dblp: '',
      orcid: '',
      linkedin: ''
    }
  },
  themes: [
    {
      id: 'theme-1',
      titleKo: '의료 바이오인포매틱스 & 딥러닝 예후 예측',
      titleEn: 'Medical AI & Bio-informatics Prognosis',
      iconName: 'Activity',
      descriptionKo: '양전자방출단층촬영(PET) 영상 및 임상 빅데이터를 통합한 딥러닝 기반 폐암 예후 예측, 뇌졸중 환자의 신경망 군집화, 암 환자 생존분석 모형을 연구합니다.',
      descriptionEn: 'Integrating PET imaging and multimodal clinical data using deep neural networks for non-small cell lung cancer prognosis and stroke patient clustering.',
      keywords: ['Medical Deep Learning', 'PET Prognosis', 'Survival Analysis', 'Non-Small Cell Lung Cancer', 'Clinical Data Mining'],
      sampleTopics: [
        'PET 영상과 임상 데이터를 결합한 비소세포폐암 환자 예후 예측 딥러닝 모형',
        '허혈성 뇌졸중 환자의 1년 혈관 질환 예후에 대한 신경망 기반 군집화',
        '국민건강보험공단(NHISS) 표본 코호트 빅데이터 생존분석'
      ]
    },
    {
      id: 'theme-2',
      titleKo: '시계열 데이터 마이닝 & 기상·농업 예측 모델링',
      titleEn: 'Time-Series Data Mining & Smart Agriculture',
      iconName: 'CloudRain',
      descriptionKo: '기상 및 토양 센서 빅데이터를 활용한 LSTM/Prophet 시계열 예측, 태풍 정보에 따른 농작물 낙과 피해율 분석 및 농산물 도매시장 가격 예측 모형을 개발합니다.',
      descriptionEn: 'Developing LSTM, non-linear regression, and Prophet models using meteorological and soil datasets for crop price forecasting and typhoon damage estimation.',
      keywords: ['LSTM / Prophet', 'Smart Farming AI', 'Typhoon Fruit Drop Analysis', 'Agricultural Price Forecasting', 'Time-series Mining'],
      sampleTopics: [
        '기상 및 수액 흐름 정보를 활용한 배나무 생장 예측 모델 개발',
        '태풍 피해일자 및 최대 풍속에 따른 사과/감 낙과 피해율 예측 프로그램',
        '생육시기 기상 변수를 활용한 배추 및 마늘 농산물 장기 가격 예측'
      ]
    },
    {
      id: 'theme-3',
      titleKo: '생체 신호 및 이미지 패턴인식 딥러닝',
      titleEn: 'Biomedical Signal & Image Pattern Recognition',
      iconName: 'Cpu',
      descriptionKo: '다중 레이블 심전도(ECG) 신호 분류를 위한 SE-ResNet 모델, 화분 발아 이미지의 CNN 및 Random Forest 기반 고정밀 자동 분류 기법을 연구합니다.',
      descriptionEn: 'Multi-label ECG signal classification using SE-ResNet architectures and computer vision models for biological particle/pollen recognition.',
      keywords: ['ECG Signal Classification', 'SE-ResNet', 'Pollen Image CNN', 'Multi-Label Learning', 'Pattern Recognition'],
      sampleTopics: [
        'SE-ResNet 기반 다중 레이블 심전도(ECG) 신호 분류 (k-Labelsets)',
        'Random Forest 및 CNN 결합 모델을 이용한 화분 발아 영상 분류',
        '3차원 공간 분석을 통한 성인 혀 위치 및 기도 형태 상관관계 규명'
      ]
    },
    {
      id: 'theme-4',
      titleKo: '응용통계 & 빅데이터 분석 방법론',
      titleEn: 'Applied Statistics & Big Data Analytics',
      iconName: 'BarChart3',
      descriptionKo: '비선형 회귀 분석, 고차원 자료분석, 다기관 의료 임상 데이터의 통계적 검정 및 인과 분석 방법론을 연구하고 교육합니다.',
      descriptionEn: 'Non-linear regression analysis, high-dimensional data analytics, and robust statistical inference for multi-center clinical trials.',
      keywords: ['Non-linear Regression', 'Big Data Statistics', 'Clinical Trial Analytics', 'Data Mining', 'R Statistics'],
      sampleTopics: [
        '원예 식물 생장 곡선 추정을 위한 다이내믹 비선형 회귀 모델 분석',
        '도매시장 등급별 농산물 기준 가격 설정 통계 모형',
        'R을 활용한 현대 응용 통계학 방법론 연구 및 서적 출판'
      ]
    }
  ],
  projects: initialProjectsData,
  publications: initialPublicationsData,
  members: [
    {
      id: 'mem-1',
      nameKo: '류지혜',
      nameEn: '',
      role: 'phd',
      roleTitleKo: '박사수료',
      roleTitleEn: 'Ph.D. Candidate',
      admissionYear: '',
      email: '',
      researchInterests: '',
      avatarUrl: '',
      currentAffiliation: ''
    },
    {
      id: 'mem-2',
      nameKo: '박은정',
      nameEn: '',
      role: 'phd',
      roleTitleKo: '박사과정',
      roleTitleEn: 'Ph.D. Candidate',
      admissionYear: '',
      email: 'eunjeongp323@gmail.com',
      researchInterests: '',
      avatarUrl: '/Park.jpg'
    },
    {
      id: 'mem-3',
      nameKo: '김선호',
      role: 'integrated',
      roleTitleKo: '석박통합과정',
      roleTitleEn: 'Integrated Ph.D.',
      admissionYear: '',
      email: 'ssuno2576@jnu.ac.kr',
      researchInterests: '',
      currentAffiliation: '데이터사이언스 대학원'
    },
    {
      id: 'mem-4',
      nameKo: '최원기',
      role: 'integrated',
      roleTitleKo: '석박통합과정',
      roleTitleEn: 'Integrated Ph.D.',
      admissionYear: '',
      email: 'wongi8994@gmail.com',
      researchInterests: '',
      avatarUrl: '/Choi.jpg'
    },
    {
      id: 'mem-5',
      nameKo: '박선정',
      nameEn: '',
      role: 'ms',
      roleTitleKo: '석사과정',
      roleTitleEn: 'M.S. Student',
      admissionYear: '',
      email: '',
      researchInterests: '',
      avatarUrl: '',
      currentAffiliation: '데이터사이언스 대학원'
    },
    {
      id: 'mem-6',
      nameKo: '오서영',
      role: 'ms',
      roleTitleKo: '석사과정',
      roleTitleEn: 'M.S. Student',
      admissionYear: '',
      researchInterests: '',
      avatarUrl: '/Oh.jpg'
    },
    {
      id: 'mem-7',
      nameKo: '정형준',
      role: 'ms',
      roleTitleKo: '석사과정',
      roleTitleEn: 'M.S. Student',
      admissionYear: '',
      researchInterests: '',
      avatarUrl: '',
      email: 'cici626@jnu.ac.kr'
    },
    {
      id: 'mem-8',
      nameKo: '이주희',
      role: 'intern',
      roleTitleKo: '학부연구생',
      roleTitleEn: 'Undergrad Intern',
      admissionYear: '',
      email: 'lee_jh@jnu.ac.kr',
      researchInterests: '',
      avatarUrl: '/Lee.jpg',
    },
    {
      id: 'mem-1788069236797',
      nameKo: '김동언',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2024)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '생육환경 예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069275029',
      nameKo: '김혜진',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2025)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '가격예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788068817508',
      nameKo: '박석주',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2014)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '기후예측 및 불확실성 정량화'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069292333',
      nameKo: '박소연',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2025)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '의료영상 분석'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788068029257',
      nameKo: '서재영',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2011)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '신용위험모형'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788068863742',
      nameKo: '손재은',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2019)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '네트워크 분석'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069190363',
      nameKo: '양정화',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2022)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '재해위험 분석'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788068730179',
      nameKo: '오광호',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2011)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '생존분석',
        '기업부도 위험 분석'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069206491',
      nameKo: '오승원',
      role: 'alumni',
      roleTitleKo: '박사 졸업(2022)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '텍스트마이닝',
        '의료영상 및 생존예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069222915',
      nameKo: '임재나',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2022)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '가격예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069308541',
      nameKo: '임호진',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2026)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '불확실성 정량화 및 예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788068997146',
      nameKo: '정다운',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2020)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '농업 생산 예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788068977260',
      nameKo: '정인철',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2019)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '농업 예측모형'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069255901',
      nameKo: '최수훈',
      role: 'alumni',
      roleTitleKo: '박사 졸업(2024)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '재해 예측'
      ],
      avatarUrl: ''
    },
    {
      id: 'mem-1788069167102',
      nameKo: '최연주',
      role: 'alumni',
      roleTitleKo: '석사 졸업(2021)',
      roleTitleEn: 'M.S. Graduate',
      researchInterests: [
        '농산물 분류체계'
      ],
      avatarUrl: ''
    }
  ],
  news: [
    {
      id: 'N-1',
      date: '2026.09.01',
      titleKo: '다변량통계분석 연구실 홈페이지 개설',
      titleEn: 'Launch of the Multivariate Statistical Analysis Laboratory Website',
      contentKo: '다변량통계분석 연구실 홈페이지를 새롭게 개설했습니다. 연구실 소개, 연구분야, 구성원, 연구성과 및 세미나 소식을 확인하실 수 있습니다.',
      contentEn: 'The Multivariate Statistical Analysis Laboratory has launched its new website. You can find information about our research areas, members, publications, seminars, and lab activities.',
      category: 'Notice'
    }
  ],
  seminars: [
    {
      id: 'seminar-1',
      date: '2026.09.04',
      titleKo: 'Lab Seminar - 논문 리뷰',
      titleEn: 'Paper Review',
      speaker: '모든 연구원',
      location: '자연과학대학 1호관 - 문헌실'
    }
  ],
  gallery: [
    {
    id: 'gal-1',
    date: '2026.09.01',
    titleKo: '연구실 소개',
    titleEn: 'Lab Introduction',
    descriptionKo: '다변량통계분석연구실 소개',
    descriptionEn: 'Introduction to the Multivariate Statistical Analysis Laboratory',
    imageUrl: '/s1.jpg', // 표지 이미지 1장만 대표로 사용
    files: [
      { type: 'pdf', url: '/MSL_Introduction.pdf' }
    ]
  }
  ],
  recruitment: {
    openings: [
      {
        typeKo: '석사/박사/석박통합 대학원생',
        typeEn: 'M.S. / Ph.D. / Integrated Graduate Students',
        count: '0명 (상시 모집)',
        target: '통계학, 컴퓨터공학, 인공지능, 수학 및 데이터 분석 열정자',
        requirements: ['Python/R 기초 역량', '의료 AI 및 통계 분석에 대한 관심', '성실하고 주도적인 연구 태도']
      },
      {
        typeKo: '학부 연구생 (Undergraduate Intern)',
        typeEn: 'Undergraduate Research Interns',
        count: '0명',
        target: '전남대학교 학부 2~4학년 재학생',
        requirements: ['주 10시간 이상 연구 참여', '프로그래밍 및 데이터 마이닝 실습 관심']
      }
    ],
    benefits: [
      {
        icon: 'dollar',
        titleKo: '등록금 및 생활 연구장학금 지원',
        titleEn: 'Tuition & Monthly Stipend',
        descKo: '풀타임 대학원생 등록금 매월 연구장학금 지급',
        descEn: 'Tuition support and monthly research living stipends.'
      },
      {
        icon: 'server',
        titleKo: '최신 연구 장비 & GPU 서버 제공',
        titleEn: 'Top-tier GPU Workstations',
        descKo: '연구용 고성능 GPU 서버 및 1인 1연구 데스크, 듀얼 모니터 완비',
        descEn: 'Individual high-end research desk with dual monitors and GPU clusters.'
      },
      {
        icon: 'plane',
        titleKo: '국내외 학술대회 참가비 지원',
        titleEn: 'Conference Travel Support',
        descKo: '국내외 저명 학술대회(KDD, IEEE, 한국데이터정보과학회) 등록비 및 출장비 지원',
        descEn: 'Registration and travel cost support for major conferences.'
      },
      {
        icon: 'users',
        titleKo: '다양한 공동 연구 기회 지원',
        titleEn: 'Interdisciplinary Collaboration',
        descKo: '대학병원, 공공기관 등과의 임상 데이터 협력 및 실전 연구 기회',
        descEn: 'Real-world clinical AI data collaboration with medical institutions.'
      }
    ],
    idealCandidate: [
      '통계학, 컴퓨터공학, 수학, 인공지능 등 데이터 분석에 열정이 있는 분',
      'Python, R, PyTorch 등 프로그래밍을 통한 알고리즘 구현에 관심이 있는 분',
      '의료 바이오 AI, 시계열 데이터 마이닝 연구를 주도적으로 수행할 분'
    ],
    procedure: [
      {
        step: 1,
        titleKo: '이메일 사전 문의',
        titleEn: 'Email Inquiry',
        descKo: 'CV, 성적증명서, 관심 연구 분야를 kimms@chonnam.ac.kr로 송부',
        descEn: 'Send CV, transcript, and research interests via email'
      },
      {
        step: 2,
        titleKo: '개별 면담',
        titleEn: 'Interview',
        descKo: '온라인 Zoom 또는 통계학과 연구실 대면 면담을 통해 연구 관심사 논의',
        descEn: 'Discuss research goals and project fit via Zoom or in-person'
      },
      {
        step: 3,
        titleKo: '대학원 전형 지원',
        titleEn: 'Admission',
        descKo: '전남대학교 일반대학원 통계학과/빅데이터융합학과 정규 전형 원서 접수',
        descEn: 'Formal graduate school application to Chonnam National University'
      }
    ],
    contactEmail: 'kimms@chonnam.ac.kr',
    inquiryTemplate: `[연구실 진학 문의] 지원자 성명_지원 희망 과정

안녕하세요, 김민수 교수님.
전남대학교 데이터사이언스 & 지능형통계 연구실(DSIS Lab)의 최신 연구 성과에 깊은 관심을 가지고 있어, 대학원 진학(또는 학부연구생)을 희망하여 문의드립니다.

- 지원 희망 과정: 석사과정 / 박사과정 / 석박통합과정 / 학부연구생
- 출신 전공 및 학년:
- 관심 연구 분야: 의료 바이오 AI / 시계열 데이터 마이닝 / 통계 모델링
- 첨부 서류: 이력서(CV) 및 성적증명서

감사합니다.`
  }
};
