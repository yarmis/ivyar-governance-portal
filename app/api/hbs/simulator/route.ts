import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { scenario, decision } = await request.json();
    const result = runSimulation(scenario, decision);
    return NextResponse.json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function runSimulation(scenario: string, decision: string): any {
  const scenarios: Record<string, any> = {
    'emergency-funding': {
      title: 'Emergency Funding Decision',
      description: 'A sudden crisis requires immediate funding reallocation of $500,000.',
      initialState: { availableFunds: 500000, affectedBeneficiaries: 10000, timeConstraint: '48 hours' },
      decisions: {
        'approve-immediate': {
          outcome: 'positive', riskLevel: 'medium', ethicalScore: 78, governanceCompliance: 65,
          consequences: [
            { type: 'positive', text: '10,000 beneficiaries receive assistance', impact: 90 },
            { type: 'negative', text: 'Planned programs disrupted', impact: -40 }
          ],
          boundariesTriggered: ['B-1: Do No Harm - Monitor', 'B-4: Financial Transparency'],
          stakeholderSatisfaction: { donors: 70, government: 80, communities: 95, staff: 60 },
          longTermEffects: ['Precedent for emergency procedures', 'Need to update protocols'],
          lessonsLearned: ['Pre-approved emergency funds needed', 'Communication protocols essential']
        },
        'follow-standard-process': {
          outcome: 'mixed', riskLevel: 'low', ethicalScore: 45, governanceCompliance: 95,
          consequences: [
            { type: 'positive', text: 'Full governance compliance maintained', impact: 85 },
            { type: 'negative', text: 'Delayed response 5-7 days', impact: -60 }
          ],
          boundariesTriggered: ['B-2: Beneficiary Protection - At Risk'],
          stakeholderSatisfaction: { donors: 85, government: 75, communities: 30, staff: 50 },
          longTermEffects: ['Process integrity maintained', 'Community trust damaged'],
          lessonsLearned: ['Emergency protocols need revision']
        },
        'partial-release': {
          outcome: 'balanced', riskLevel: 'medium', ethicalScore: 72, governanceCompliance: 75,
          consequences: [
            { type: 'positive', text: 'Immediate critical needs addressed', impact: 70 },
            { type: 'neutral', text: 'Phased approach manageable', impact: 20 }
          ],
          boundariesTriggered: ['B-1: Do No Harm - Active'],
          stakeholderSatisfaction: { donors: 75, government: 78, communities: 80, staff: 70 },
          longTermEffects: ['Flexible response model established'],
          lessonsLearned: ['Phased approaches can balance competing needs']
        }
      }
    },
    'partner-misconduct': {
      title: 'Partner Misconduct Discovery',
      description: 'Partner has been inflating beneficiary numbers by 20%.',
      initialState: { partnerBudget: 2000000, affectedPrograms: 5, partnerDuration: '3 years' },
      decisions: {
        'immediate-termination': {
          outcome: 'mixed', riskLevel: 'high', ethicalScore: 60, governanceCompliance: 85,
          consequences: [
            { type: 'positive', text: 'Strong accountability signal', impact: 80 },
            { type: 'negative', text: 'Program disruption for 15,000 beneficiaries', impact: -75 }
          ],
          boundariesTriggered: ['B-2: Beneficiary Protection - At Risk'],
          stakeholderSatisfaction: { donors: 80, government: 70, communities: 40, staff: 45 },
          longTermEffects: ['Deterrent effect on partners', 'Service gap'],
          lessonsLearned: ['Need transition plans before termination']
        },
        'investigation-and-remediation': {
          outcome: 'positive', riskLevel: 'medium', ethicalScore: 75, governanceCompliance: 80,
          consequences: [
            { type: 'positive', text: 'Full understanding of issues', impact: 75 },
            { type: 'positive', text: 'Program continuity maintained', impact: 65 }
          ],
          boundariesTriggered: ['B-4: Financial Transparency - Active'],
          stakeholderSatisfaction: { donors: 70, government: 75, communities: 85, staff: 75 },
          longTermEffects: ['Stronger partner oversight systems'],
          lessonsLearned: ['Investigation before action']
        },
        'cover-up': {
          outcome: 'negative', riskLevel: 'critical', ethicalScore: 5, governanceCompliance: 5,
          consequences: [
            { type: 'negative', text: 'Ethical violation compounded', impact: -90 },
            { type: 'negative', text: 'Institutional reputation at risk', impact: -80 }
          ],
          boundariesTriggered: ['B-3: VIOLATED', 'B-4: VIOLATED', 'B-9: VIOLATED'],
          stakeholderSatisfaction: { donors: 0, government: 0, communities: 0, staff: 0 },
          longTermEffects: ['Organizational collapse risk', 'Legal consequences'],
          lessonsLearned: ['Cover-ups always fail', 'Transparency is non-negotiable']
        }
      }
    },
    'community-conflict': {
      title: 'Community Conflict Over Resources',
      description: 'Two communities in conflict over resource distribution.',
      initialState: { communities: 2, beneficiaries: 8000, resourceValue: 300000 },
      decisions: {
        'equal-split': {
          outcome: 'mixed', riskLevel: 'medium', ethicalScore: 65, governanceCompliance: 70,
          consequences: [
            { type: 'positive', text: 'Perceived fairness', impact: 60 },
            { type: 'negative', text: 'May not reflect actual needs', impact: -45 }
          ],
          boundariesTriggered: ['B-1: Do No Harm - Monitor'],
          stakeholderSatisfaction: { donors: 70, government: 65, communities: 55, staff: 60 },
          longTermEffects: ['Temporary peace', 'Underlying issues unresolved'],
          lessonsLearned: ['Equal is not always equitable']
        },
        'needs-based-allocation': {
          outcome: 'positive', riskLevel: 'medium', ethicalScore: 80, governanceCompliance: 85,
          consequences: [
            { type: 'positive', text: 'Resources match actual needs', impact: 80 },
            { type: 'negative', text: 'Community with less may feel aggrieved', impact: -50 }
          ],
          boundariesTriggered: ['B-1: Do No Harm - Active', 'B-2: Active'],
          stakeholderSatisfaction: { donors: 85, government: 80, communities: 65, staff: 75 },
          longTermEffects: ['Establishes needs-based precedent'],
          lessonsLearned: ['Communication is key', 'Transparent criteria build trust']
        },
        'community-led-decision': {
          outcome: 'positive', riskLevel: 'low', ethicalScore: 90, governanceCompliance: 90,
          consequences: [
            { type: 'positive', text: 'Community ownership of solution', impact: 85 },
            { type: 'positive', text: 'Builds local capacity', impact: 75 }
          ],
          boundariesTriggered: ['B-1: Do No Harm - Positive'],
          stakeholderSatisfaction: { donors: 80, government: 85, communities: 90, staff: 85 },
          longTermEffects: ['Empowered communities', 'Model for future conflicts'],
          lessonsLearned: ['Community-led solutions are most sustainable']
        }
      }
    }
  };

  const sim = scenarios[scenario] || scenarios['emergency-funding'];
  const decisionResult = decision ? sim.decisions[decision] : null;

  return {
    scenario: sim.title,
    description: sim.description,
    initialState: sim.initialState,
    decision,
    result: decisionResult,
    availableDecisions: Object.keys(sim.decisions).map(d => ({
      id: d,
      label: d.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    }))
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Governance Simulator',
    version: '1.5',
    scenarios: ['emergency-funding', 'partner-misconduct', 'community-conflict']
  });
}