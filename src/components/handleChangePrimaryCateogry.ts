import { TypeMergeData } from '../composables/useMergeTransaction';
import { ElNotification } from 'element-plus';

export function handleChangePrimaryCateogry(row: TypeMergeData) {
// validate primaryCategory with notification
if (!row.categoryId) {
ElNotification({
title: 'Error',
message: 'Please select a category',
type: 'error'
});
}
try {
if (row.type === 'credit') {
updateCreditCardCategory(row);
} else {
updateAccountCategory(row);
}
}
catch (error: unknown) {
if (_.isError(error))
ElNotification({
title: 'Error',
message: error.message,
type: 'error'
});
}
}
