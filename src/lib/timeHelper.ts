export function formatDate(dateString: string): { shortDate: string, date: string } {
    const now = new Date();
    const date = new Date(dateString);
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    let shortDate;
    if (daysAgo >= 180) {
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        shortDate = `${day} ${month} ${year}`;
    } else if (hoursAgo >= 24) {
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        shortDate = `${day} ${month}`;
    } else if (hoursAgo >= 1) {
        shortDate = `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else if (minutesAgo >= 1) {
        shortDate = `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    } else {
        shortDate = "a few seconds ago";
    }

    const dateISO = date.toISOString();
    return { shortDate, date: dateISO };
}
