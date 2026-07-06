export default {
    '*.{ts,js}': [
        'eslint --fix --max-warnings=0',
        'prettier --write',
    ],
};