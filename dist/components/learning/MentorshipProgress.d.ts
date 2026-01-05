interface MentorshipProgram {
    id: string;
    name: string;
    mentorName: string;
    mentorAvatar?: string;
    startDate: string;
    expiryDate: string;
    sessionsTotal: number;
    sessionsCompleted: number;
    status: 'active' | 'expired' | 'completed';
    lastSessionDate?: string;
    nextSessionDate?: string;
}
export declare function MentorshipProgress({ programs }: {
    programs: MentorshipProgram[];
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MentorshipProgress.d.ts.map