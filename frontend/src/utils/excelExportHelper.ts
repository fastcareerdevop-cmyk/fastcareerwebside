import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getResumeUrl } from './urlHelper';

/**
 * Format any date string to DD-MM-YYYY (e.g. 1984-10-13 -> 13-10-1984)
 */
export const formatDateToDDMMYYYY = (dateVal: any): string => {
  if (!dateVal) return 'N/A';
  const s = String(dateVal).trim();
  if (!s || s === 'N/A' || s === '-') return 'N/A';

  // If already in DD-MM-YYYY format
  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    return s;
  }

  // If in YYYY-MM-DD format (e.g. 1984-10-13 or 1984-10-13T00:00:00.000Z)
  const isoMatch = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${d}-${m}-${y}`;
  }

  // If in DD/MM/YYYY format
  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${d}-${m}-${y}`;
  }

  // Fallback using Date parser
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return s;
};

/**
 * Format articleship completion date to MMM-YY format (e.g. "May 2025" -> "May-25")
 */
export const formatArticleshipCompletionDate = (
  month?: string,
  year?: string,
  fullStr?: string
): string => {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Case 1: Separate month and year provided
  if (month && year) {
    const cleanM = month.trim();
    const cleanY = String(year).trim().slice(-2);
    const capitalizedM = cleanM.charAt(0).toUpperCase() + cleanM.slice(1, 3).toLowerCase();
    return `${capitalizedM}-${cleanY}`;
  }

  // Case 2: Full string e.g. "May 2025", "May 25", "May'25", "2025-05", "May-2025"
  if (fullStr) {
    const s = String(fullStr).trim();
    if (!s || s === 'N/A' || s === '-') return 'N/A';

    // Match text and year e.g. "May 2025", "May-25", "Sept'25", "October 2024"
    const textYearMatch = s.match(/([a-zA-Z]{3,9})[\s\-']+(\d{2,4})/);
    if (textYearMatch) {
      let rawM = textYearMatch[1];
      if (rawM.toLowerCase().startsWith('sept')) rawM = 'Sep';
      const m = rawM.charAt(0).toUpperCase() + rawM.slice(1, 3).toLowerCase();
      const y = textYearMatch[2].slice(-2);
      return `${m}-${y}`;
    }

    // Match ISO format e.g. "2025-05"
    const isoMatch = s.match(/^(\d{4})[-/](\d{1,2})/);
    if (isoMatch) {
      const y = isoMatch[1].slice(-2);
      const mIdx = parseInt(isoMatch[2], 10) - 1;
      const m = shortMonths[mIdx] || isoMatch[2];
      return `${m}-${y}`;
    }

    return s;
  }

  return 'N/A';
};

/**
 * Format registration timestamp into separate date, time (12h AM/PM), and full string
 */
export const formatRegistrationTimestamp = (dateVal: any) => {
  if (!dateVal) {
    return { date: 'N/A', time: 'N/A', full: 'N/A' };
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) {
    return { date: 'N/A', time: 'N/A', full: 'N/A' };
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const timeFormatted = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return {
    date: formattedDate,
    time: timeFormatted,
    full: `${formattedDate} ${timeFormatted}`
  };
};

export const formatCandidateForExcel = (c: any, index?: number) => {
  const pd = c.personalDetails || {};
  const ca = c.caPortfolio || {};
  const inter = ca.caInter || {};
  const final = ca.caFinal || {};
  const exp = c.experienceInfo || {};
  const qual = c.qualifications || {};
  const grad = qual.graduation || {};
  const c12 = qual.class12 || {};
  const c10 = qual.class10 || {};
  const articleships = Array.isArray(ca.articleships) ? ca.articleships : [];

  const rawDob = pd.dateOfBirth || c.dateOfBirth || c.dob || '';
  const regInfo = formatRegistrationTimestamp(c.createdAt);

  const company = (exp.currentCompanyName || c.experienceInfo?.currentCompanyName || '').trim().toUpperCase();
  const isRealCompany = company.length > 0 && company !== 'N/A' && company !== 'NA' && company !== 'NONE';

  const isFresher = (
    ca.isFresherCA === true || 
    c.isFresherCA === true || 
    exp.isExperienced === false || 
    c.experienceInfo?.isExperienced === false
  );

  const isExp = !isFresher && Boolean(
    exp.isExperienced === true || 
    c.experienceInfo?.isExperienced === true || 
    isRealCompany
  );

  return {
    'S. No.': typeof index === 'number' ? index + 1 : 1,
    'FullName': `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.name || 'N/A',
    'EmailID': c.email || 'N/A',
    'MobNo': c.phone || pd.phone || 'N/A',
    'PerCity': pd.permanentCity || 'N/A',
    'PerState': pd.permanentState || 'N/A',
    'CurCity': pd.currentCity || c.currentCity || 'N/A',
    'CurState': pd.currentState || 'N/A',
    'DOB': formatDateToDDMMYYYY(rawDob),
    'Gender': pd.gender || c.gender || 'N/A',
    'MaritialStatus': pd.maritalStatus || 'N/A',
    'IsCAFinalBothGrpIn1stAtt': final.bothGroups1stAttempt ? 'Yes' : 'No',
    'CAFinalG1_AttNos': final.group1Attempts || 'N/A',
    'CAFinalG2_AttNos': final.group2Attempts || 'N/A',
    'CAFinal_IsRanker': (final.ranker === 'No' || !final.ranker) ? 'No' : String(final.ranker),
    'CAFinalSession': final.completionSessionMonth && final.completionSessionYear 
      ? `${final.completionSessionMonth} ${final.completionSessionYear}` 
      : (final.completionSessionYear || exp.caFinalCompletionYear || 'N/A'),
    'IsCAInterBothGrpIn1stAtt': inter.bothGroups1stAttempt ? 'Yes' : 'No',
    'CAInterG1_AttNos': inter.group1Attempts || 'N/A',
    'CAInterG2_AttNos': inter.group2Attempts || 'N/A',
    'CAInter_IsRanker': (inter.ranker === 'No' || !inter.ranker) ? 'No' : String(inter.ranker),
    'CAInterSession': inter.completionSessionMonth && inter.completionSessionYear 
      ? `${inter.completionSessionMonth} ${inter.completionSessionYear}` 
      : (inter.completionSessionYear || 'N/A'),
    'ArtCompletionDate': formatArticleshipCompletionDate(
      ca.articleshipCompletionDateMonth, 
      ca.articleshipCompletionDateYear, 
      ca.articleshipCompletionDate
    ),
    'ArtFirmName_1': articleships[0]?.firmName || ca.articleshipFirm || 'N/A',
    'ArtFirmCity_1': articleships[0]?.city || ca.articleshipCity || 'N/A',
    'ArtNoOfPartners_1': articleships[0]?.noOfPartners || 'N/A',
    'ArtFirmName_2': articleships[1]?.firmName || 'N/A',
    'ArtFirmName_3': articleships[2]?.firmName || 'N/A',
    'IsFresher': isExp ? 'No' : 'Yes',
    'CurOrg': exp.currentCompanyName || 'N/A',
    'CurOrgCtc': exp.currentCTC || 'N/A',
    'CurOrgNoticePeriod': exp.noticePeriod || 'N/A',
    'IsUg_Completed': grad.completed || (grad.yearOfCompletion ? 'Yes' : 'No'),
    'UG_Year': grad.yearOfCompletion || 'N/A',
    'UG_Per': grad.percentage ? `${grad.percentage}%` : 'N/A',
    'UG_College': grad.college || grad.collegeName || 'N/A',
    'UG_RegularCorrspondence': grad.type || 'Regular',
    'XII_per': c12.percentage ? `${c12.percentage}%` : 'N/A',
    'XII_Board': c12.board || 'N/A',
    'XII_Year': c12.year || 'N/A',
    'X_per': c10.percentage ? `${c10.percentage}%` : 'N/A',
    'X_Board': c10.board || 'N/A',
    'X_Year': c10.year || 'N/A',
    'ParticipateCity': pd.preferredCampusCity || pd.prefCity1 || 'N/A',
    'ArticleshipBig': (ca.big4Articleship && ca.big4Articleship !== 'No' && ca.big4Articleship !== 'none' && ca.big4Articleship !== '') ? 'Yes' : 'No',
    'IndustrialTrainee': ca.industrialTrainee || 'No',
    'ITCompanyName': ca.itCompanyName || ca.industrialCompany || (ca.industrialTrainee === 'Yes' ? (ca.natureOfWork || 'N/A') : 'N/A'),
    'CAFinalPer': final.percentage ? `${final.percentage}%` : 'N/A',
    'IsListedCompanyWork': ca.listedCompanyWork || 'No',
    'NatureOfWork': ca.natureOfWork || exp.workProfile || 'N/A',
    'CreatedOn': regInfo.full || 'N/A'
  };
};

/**
 * Downloads a complete .xlsx Excel spreadsheet with every single candidate field
 */
export const downloadCandidatesExcel = (candidates: any[], fileNamePrefix = 'Candidates_Full_Data') => {
  if (!candidates || candidates.length === 0) return;

  const excelData = candidates.map((c, idx) => formatCandidateForExcel(c, idx));
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set optimal column widths
  const columnKeys = Object.keys(excelData[0] || {});
  worksheet['!cols'] = columnKeys.map(key => {
    const maxValLength = Math.max(
      key.length,
      ...excelData.map(row => String((row as any)[key] || '').length).slice(0, 50)
    );
    return { wch: Math.min(Math.max(maxValLength + 3, 12), 45) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates Database');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });

  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `${fileNamePrefix}_${dateStr}.xlsx`);
};

/**
 * Standard 16-Column Formatter matching the user-specified format:
 * 1. Name
 * 2. Email Address
 * 3. Phone Number
 * 4. Current Location
 * 5. Current State
 * 6. Permanent Location
 * 7. Permanent State
 * 8. DOB
 * 9. Gender
 * 10. CA Inter Batch
 * 11. CA both Group in 1st Attempt
 * 12. Group 1
 * 13. Group 2
 * 14. CA Inter Rank
 * 15. Articleship Firm's Name 1
 * 16. Articleship Start Month and Year
 */
export const formatCandidateTo16Columns = (item: any) => {
  const pd = item.personalDetails || {};
  const ca = item.caPortfolio || {};
  const inter = ca.caInter || {};
  const articleships = Array.isArray(ca.articleships) ? ca.articleships : [];
  const primaryArt = articleships[0] || {};

  const name = (
    item.name ||
    `${item.firstName || ''} ${item.lastName || ''}`.trim() ||
    'N/A'
  );

  const rawDob = pd.dateOfBirth || item.dateOfBirth || item.dob || '';
  const dobFormatted = formatDateToDDMMYYYY(rawDob);

  // CA Inter Batch
  let interBatch = item.caInterBatch || '';
  if (!interBatch && inter.completionSessionMonth && inter.completionSessionYear) {
    interBatch = `${inter.completionSessionMonth} ${inter.completionSessionYear}`;
  } else if (!interBatch && inter.completionSessionYear) {
    interBatch = String(inter.completionSessionYear);
  } else if (!interBatch) {
    interBatch = 'N/A';
  }

  // CA both Group in 1st Attempt
  let both1st = 'No';
  if (item.bothGroups1stAttempt !== undefined && item.bothGroups1stAttempt !== null) {
    both1st = (item.bothGroups1stAttempt === 'Yes' || item.bothGroups1stAttempt === true) ? 'Yes' : 'No';
  } else if (inter.bothGroups1stAttempt !== undefined) {
    both1st = inter.bothGroups1stAttempt ? 'Yes' : 'No';
  }

  // Group 1
  let g1 = item.group1 || '';
  if (!g1) {
    if (inter.group1Attempts) {
      g1 = String(inter.group1Attempts) === '1' ? '1st Attempt' : `${inter.group1Attempts} Attempt(s)`;
    } else if (both1st === 'Yes') {
      g1 = '1st Attempt';
    } else {
      g1 = 'N/A';
    }
  }

  // Group 2
  let g2 = item.group2 || '';
  if (!g2) {
    if (inter.group2Attempts) {
      g2 = String(inter.group2Attempts) === '1' ? '1st Attempt' : `${inter.group2Attempts} Attempt(s)`;
    } else if (both1st === 'Yes') {
      g2 = '1st Attempt';
    } else {
      g2 = 'N/A';
    }
  }

  // CA Inter Rank
  let rank = item.caInterRank || '';
  if (!rank || rank === 'No') {
    if (inter.ranker && inter.ranker !== 'No' && inter.ranker !== 'No Rank') {
      rank = String(inter.ranker);
    } else {
      rank = 'No Rank';
    }
  }

  // Articleship Firm's Name 1
  const firmName1 = (
    item.articleshipFirmName ||
    primaryArt.firmName ||
    ca.articleshipFirm ||
    'N/A'
  );

  // Articleship Start Month and Year
  let artStart = item.articleshipStartMonthYear || primaryArt.startDate || primaryArt.startMonthYear || '';
  if (!artStart) {
    if (ca.articleshipCompletionDateMonth || ca.articleshipCompletionDateYear || ca.articleshipCompletionDate) {
      artStart = formatArticleshipCompletionDate(ca.articleshipCompletionDateMonth, ca.articleshipCompletionDateYear, ca.articleshipCompletionDate);
    } else {
      artStart = 'N/A';
    }
  }

  return {
    'Name': name,
    'Email Address': item.email || 'N/A',
    'Phone Number': item.phone || pd.phone || 'N/A',
    'Current Location': pd.currentCity || item.currentCity || item.currentLocation || 'N/A',
    'Current State': pd.currentState || item.currentState || 'N/A',
    'Permanent Location': pd.permanentCity || item.permanentLocation || pd.currentCity || item.currentLocation || 'N/A',
    'Permanent State': pd.permanentState || item.permanentState || pd.currentState || item.currentState || 'N/A',
    'DOB': dobFormatted,
    'Gender': pd.gender || item.gender || 'N/A',
    'CA Inter Batch': interBatch,
    'CA both Group in 1st Attempt': both1st,
    'Group 1': g1,
    'Group 2': g2,
    'CA Inter Rank': rank,
    "Articleship Firm's Name 1": firmName1,
    'Articleship Start Month and Year': artStart
  };
};

/**
 * Downloads standardized 16-column Excel spreadsheet
 */
export const downloadFormatted16FieldExcel = (items: any[], fileNamePrefix = 'Candidates_Format_Data') => {
  if (!items || items.length === 0) return;

  const excelData = items.map(formatCandidateTo16Columns);
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Column widths customized for standard 16 columns
  worksheet['!cols'] = [
    { wch: 24 }, // Name
    { wch: 28 }, // Email Address
    { wch: 16 }, // Phone Number
    { wch: 18 }, // Current Location
    { wch: 18 }, // Current State
    { wch: 20 }, // Permanent Location
    { wch: 18 }, // Permanent State
    { wch: 14 }, // DOB
    { wch: 12 }, // Gender
    { wch: 18 }, // CA Inter Batch
    { wch: 28 }, // CA both Group in 1st Attempt
    { wch: 16 }, // Group 1
    { wch: 16 }, // Group 2
    { wch: 16 }, // CA Inter Rank
    { wch: 30 }, // Articleship Firm's Name 1
    { wch: 32 }  // Articleship Start Month and Year
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates 16 Format');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' 
  });

  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `${fileNamePrefix}_${dateStr}.xlsx`);
};

