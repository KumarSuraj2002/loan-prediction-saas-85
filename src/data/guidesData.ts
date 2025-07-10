
export interface GuideSection {
  title: string;
  content: string;
}

export interface Guide {
  id: number;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  estimatedTime: string;
  icon: string;
  color: string;
  content?: {
    intro: string;
    sections: GuideSection[];
    conclusion: {
      title: string;
      content: string;
    };
    tips?: string[];
    resources?: Array<{
      title: string;
      url: string;
    }>;
  };
}

export const guides: Guide[] = [
  {
    id: 1,
    title: "Understanding Credit Scores",
    description: "Learn what makes up your credit score, how it affects your financial options, and practical tips to improve it.",
    level: "Beginner",
    category: "Credit",
    estimatedTime: "15 mins",
    icon: "📊",
    color: "bg-blue-100",
    content: {
      intro: "Your credit score is a three-digit number that represents your creditworthiness to lenders. Understanding how this score works is essential for accessing favorable loans, credit cards, and even rental opportunities. This guide breaks down what makes up your credit score, how it impacts your financial life, and actionable steps to improve it.",
      sections: [
        {
          title: "What Is a Credit Score?",
          content: "A credit score is a numerical value, typically between 300 and 850, that represents your creditworthiness. Lenders use this score to evaluate the risk of lending you money. Higher scores indicate lower risk, leading to better interest rates and loan terms. The most commonly used scoring models are FICO and VantageScore, with FICO being the most widely adopted by lenders. While the exact algorithms are proprietary, both models use similar factors to calculate your score, including payment history, credit utilization, length of credit history, credit mix, and new credit applications."
        },
        {
          title: "Factors That Influence Your Credit Score",
          content: "Payment History (35% of your score): This is the most influential factor and tracks whether you've paid past credit accounts on time. Even one late payment can significantly impact your score, with more recent late payments causing more damage than older ones. Credit Utilization (30%): This represents the amount of credit you're using compared to your total available credit. Keeping this ratio below 30% is recommended, though lower is better. Length of Credit History (15%): This considers the age of your oldest and newest accounts, as well as the average age of all accounts. Older accounts positively affect your score, which is why closing old accounts can sometimes lower your score. Credit Mix (10%): Having different types of credit (revolving accounts like credit cards, and installment loans like mortgages or student loans) demonstrates that you can manage various credit types. New Credit (10%): This includes recent credit inquiries and newly opened accounts. Applying for several new accounts in a short period can indicate higher risk."
        },
        {
          title: "Practical Steps to Improve Your Credit Score",
          content: "Pay all bills on time. Set up automatic payments or payment reminders to avoid late payments. Reduce credit card balances, focusing on cards with the highest utilization rates first. Don't close old credit cards, even if you don't use them regularly (unless they have annual fees). Limit applications for new credit. Each application typically results in a hard inquiry, which can temporarily lower your score. Check your credit report regularly for errors and dispute any inaccuracies. Consider using tools like Experian Boost or UltraFICO that incorporate additional data like utility payments or banking activity. If you're building credit from scratch, consider secured credit cards or becoming an authorized user on someone else's well-established account. Be patient—significant improvements in credit scores often take 3-6 months of consistent positive behavior."
        }
      ],
      conclusion: {
        title: "Credit Score Management is a Long-Term Strategy",
        content: "Improving and maintaining a good credit score is a marathon, not a sprint. While some negative factors can immediately impact your score, building positive credit history takes time and consistency. Monitor your progress regularly, but don't obsess over small fluctuations—focus on the overall trend. Remember that your credit score is just one aspect of your financial health. Balancing credit improvement with other financial goals like emergency savings and retirement planning is essential for true financial wellbeing. By understanding how credit scores work and implementing these strategies, you'll be well on your way to unlocking better financial opportunities and lower costs throughout your life."
      },
      tips: [
        "Sign up for a free credit monitoring service to track changes to your score",
        "Consider setting up automatic payments to never miss a due date",
        "Keep your oldest credit card active with small purchases to maintain credit history",
        "Aim to use less than 10% of your available credit for optimal scores"
      ],
      resources: [
        {
          title: "Annual Credit Report",
          url: "https://www.annualcreditreport.com"
        },
        {
          title: "Consumer Financial Protection Bureau",
          url: "https://www.consumerfinance.gov"
        },
        {
          title: "myFICO Credit Education",
          url: "https://www.myfico.com/credit-education"
        }
      ]
    }
  },
  {
    id: 2,
    title: "First-Time Home Buyer's Guide",
    description: "Everything you need to know about purchasing your first home, from saving for a down payment to closing the deal.",
    level: "Beginner",
    category: "Mortgages",
    estimatedTime: "30 mins",
    icon: "🏠",
    color: "bg-green-100",
    content: {
      intro: "Buying your first home is both exciting and overwhelming. This comprehensive guide walks you through the entire process, from determining if you're ready to buy to the moment you receive your keys. We'll cover financial preparation, mortgage options, house hunting strategies, and the closing process to help make your homebuying journey smoother.",
      sections: [
        {
          title: "Determining If You're Ready to Buy",
          content: "Homeownership is a significant financial commitment that goes beyond simply comparing your mortgage payment to your current rent. Before starting your homebuying journey, assess your financial stability, including steady employment (ideally at least two years in the same field), manageable debt levels, and sufficient savings for a down payment and closing costs (typically 3-20% of the purchase price and 2-5% for closing costs, respectively). Consider your long-term plans—buying generally makes more financial sense if you plan to stay in the home for at least 3-5 years. Also evaluate your readiness for maintenance responsibilities and reduced mobility compared to renting. Various online calculators and affordability tools can help you determine if buying makes financial sense given your specific circumstances."
        },
        {
          title: "Financial Preparation and Mortgage Options",
          content: "Start by checking and improving your credit score, as this significantly impacts your interest rate and approval odds. Aim for a score of at least 620, though 740+ will qualify you for the best rates. Save aggressively for your down payment and closing costs, considering first-time homebuyer programs that may offer down payment assistance. Get pre-approved for a mortgage before house hunting to understand your budget and strengthen your offer. Conventional loans typically require a minimum 3% down payment and good credit. FHA loans accept lower credit scores (as low as 580) with a 3.5% down payment. VA loans offer military members and veterans zero down payment options with competitive rates. USDA loans provide zero down payment options for rural areas to qualified buyers. Each loan type has specific requirements, benefits, and limitations, so research thoroughly or consult with a mortgage professional to determine which is best for your situation."
        },
        {
          title: "Finding the Right Home",
          content: "Create a detailed list of needs versus wants in a property, considering factors like location, size, layout, and specific features. Research potential neighborhoods for safety, school quality, commute times, amenities, and future development plans. Work with a buyer's agent who specializes in your target area—their services are typically free to buyers as sellers pay the commission. When viewing properties, look beyond cosmetic issues to assess structural integrity, systems (electrical, plumbing, HVAC), roof condition, and potential repair needs. Consider the home's resale potential even if you plan to stay long-term. Once you find the right property, work with your agent to develop an offer strategy based on market conditions, comparable sales, and the property's condition. Be prepared for negotiations on price, closing timeline, and contingencies."
        }
      ],
      conclusion: {
        title: "From Accepted Offer to Closing",
        content: "Once your offer is accepted, navigate the closing process carefully. Schedule a professional home inspection to identify any issues ($300-500 well spent), and negotiate repairs or credits if significant problems arise. Secure your mortgage financing by providing all required documentation promptly. Review the Loan Estimate and Closing Disclosure carefully to understand all costs. Conduct a final walk-through 24 hours before closing to verify the home's condition hasn't changed. At closing, you'll sign numerous documents, pay closing costs, and receive your keys. Remember that the homebuying process typically takes 30-60 days from accepted offer to closing. Throughout this journey, maintain open communication with your agent, lender, and attorney (if applicable) to address any issues promptly. While the process can be stressful, proper preparation and guidance from professionals will help you navigate the path to homeownership successfully."
      },
      tips: [
        "Get pre-approved, not just pre-qualified, before house hunting",
        "Don't make major purchases or open new credit accounts during the mortgage process",
        "Set aside additional funds beyond down payment for moving costs and immediate home needs",
        "Consider home warranty options, especially for older homes"
      ],
      resources: [
        {
          title: "HUD First-Time Homebuyer Programs",
          url: "https://www.hud.gov/topics/buying_a_home"
        },
        {
          title: "Consumer Financial Protection Bureau Homebuyer Resources",
          url: "https://www.consumerfinance.gov/owning-a-home/"
        },
        {
          title: "National Association of Realtors - Home Buying Steps",
          url: "https://www.nar.realtor/"
        }
      ]
    }
  },
  {
    id: 3,
    title: "Building an Emergency Fund",
    description: "Why you need an emergency fund, how much to save, and strategies for building it up even on a tight budget.",
    level: "Beginner",
    category: "Savings",
    estimatedTime: "10 mins",
    icon: "💰",
    color: "bg-yellow-100",
    content: {
      intro: "An emergency fund is your financial safety net—a dedicated amount of money set aside to cover unexpected expenses and financial surprises. From sudden car repairs to medical emergencies or job loss, having this buffer can prevent a difficult situation from becoming a financial disaster. This guide will help you understand why emergency funds are crucial, how much you should save, and practical strategies to build your fund even with limited resources.",
      sections: [
        {
          title: "Why Emergency Funds Are Essential",
          content: "Emergency funds provide financial security and peace of mind during unexpected situations. They help you avoid high-interest debt from credit cards or payday loans when emergencies occur. Having dedicated emergency savings prevents you from tapping into retirement accounts or other long-term investments, which can trigger penalties and derail your financial goals. Emergency funds also give you the freedom to make better decisions during difficult times, such as leaving a toxic job or relationship, without financial panic. Studies consistently show that having even a small emergency fund dramatically reduces financial stress and improves overall wellbeing. Without this financial buffer, even minor setbacks can trigger a cascade of financial problems, including late fees, credit score damage, and increasing debt."
        },
        {
          title: "How Much Should You Save?",
          content: "Financial experts traditionally recommend saving 3-6 months of essential expenses in your emergency fund. Essential expenses include housing, utilities, food, insurance, minimum debt payments, and other necessities—not discretionary spending like entertainment or vacations. However, the ideal amount varies based on your personal circumstances. Consider saving closer to 6 months (or more) if: You have variable or commission-based income, you're self-employed, you're a single-income household, you have dependents, you have chronic health issues, or you work in a specialized field where finding new employment might take longer. Those with more stable situations might be comfortable with 3 months of expenses. Remember that building even a $1,000 starter emergency fund provides significant protection against many common emergencies while you work toward your full savings goal."
        },
        {
          title: "Practical Strategies for Building Your Fund",
          content: "Start small with an achievable initial goal, such as $500 or $1,000, before working toward your full 3-6 month target. Automate your savings by setting up direct deposit from your paycheck or automatic transfers from checking to your emergency fund—what you don't see, you won't miss. Use windfalls wisely by allocating at least a portion of tax refunds, bonuses, or gift money to your emergency fund. Find ways to increase your income temporarily through side gigs, overtime, or selling unused items. Look for expenses to trim in your current budget, redirecting those savings to your emergency fund. Consider using high-yield savings accounts to earn interest while maintaining liquidity. Track your progress and celebrate milestones to stay motivated. If you're struggling to save, try money-saving challenges like the 52-week challenge (save $1 the first week, $2 the second week, and so on) or the no-spend challenge (designate certain days or categories as no-spend)."
        }
      ],
      conclusion: {
        title: "Maintaining and Using Your Emergency Fund Appropriately",
        content: "Once you've built your emergency fund, keep it in an accessible but separate account to avoid the temptation of casual spending. High-yield savings accounts, money market accounts, or cash management accounts offer good combinations of accessibility, safety, and modest returns. Be clear about what constitutes a genuine emergency—unexpected, necessary, and urgent expenses—versus planned expenses or impulse purchases. After using your emergency fund, make replenishing it a top financial priority. Review your emergency fund target annually or after major life changes (marriage, children, home purchase, etc.) to ensure it still meets your needs. Remember that an emergency fund is just one component of your financial security. Once you've established your fund, you can focus more energy on other goals like retirement savings, debt reduction, or investing with greater confidence. Your emergency fund provides the foundation that makes all other financial progress possible and sustainable."
      },
      tips: [
        "Keep your emergency fund in a separate account from your regular checking",
        "Use a high-yield savings account to earn interest while maintaining liquidity",
        "Review and adjust your emergency fund target after major life changes",
        "Save your change and small bills in a jar and deposit monthly"
      ],
      resources: [
        {
          title: "Consumer Financial Protection Bureau - Emergency Fund Resources",
          url: "https://www.consumerfinance.gov/start-small-save-up/"
        },
        {
          title: "America Saves",
          url: "https://americasaves.org/"
        },
        {
          title: "National Foundation for Credit Counseling",
          url: "https://www.nfcc.org/"
        }
      ]
    }
  }
  // Additional guide data could be added here for the other guides
];
