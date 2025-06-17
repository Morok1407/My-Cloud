import User from "../models/user.js";

export const updateSubscriptions = async () => {
try {
    const users = await User.find({ SubscriptionType: { $ne: 'Free' } });

    for (const user of users) {
        if (user.RemainingPeriod > 0) {
        user.RemainingPeriod -= 1;

        if (user.RemainingPeriod === 0) {
            user.SubscriptionType = 'Free';
        }

            await user.save();
        } 
    }
    } catch (error) {
        console.error('Error updating subscriptions:', error);
    }
};
