import { RecommendationType } from "@/lib/types";

export const getOverviewRecommendation = async (userId: string): Promise<RecommendationType[]> => {
    try {
        const response = await fetch(`/api/ai/overview?userId=${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching overview: ${response.statusText}`);
        }
        const result = await response.json();

        if (!result || !result.data) {
            console.error('Invalid response structure:', result);
            return [];
        }

        let textContent = result.data.candidates[0].content.parts[0].text;

        try {
            textContent = textContent
                .replace(/```json\n/, '')
                .replace(/```/, '')
                .trim();

            const parsedRecommendations = JSON.parse(textContent);
            if (!Array.isArray(parsedRecommendations)) {
                console.error('Parsed data is not an array:', parsedRecommendations);
                return [];
            }
            return parsedRecommendations;
        } catch (parseError) {
            console.error('Error parsing recommendations JSON:', parseError);
            console.error('Text content was:', textContent);
            return [];
        }
    } catch (error) {
        console.error('Error in getOverviewRecommendation:', error);
        return [];
    }
}
