import { QuestionCircleOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Select, Tooltip } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const Protocol = {
  Http: "HTTP",
  Https: "HTTPS",
};

const DomainForm: React.FC = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const { value } = props;
  const [form] = Form.useForm();
  const [protocol, setProtocol] = useState<string>(Protocol.Http);

  useEffect(() => {
    form.resetFields();

    if (value) {
      const { name, protocol } = value;
      setProtocol(protocol);
      const values = { name, protocol };
      if (value.certIdentifier) {
        Object.assign(values, { certIdentifier: value.certIdentifier });
      }
      let _mustHttps: boolean[] = [];
      if (value.mustHttps) {
        _mustHttps = [true];
        Object.assign(values, { mustHttps: _mustHttps });
      }
      form.setFieldsValue(values);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    reset: () => form.resetFields(),
    handleSubmit: () => (form.validateFields()),
  }));

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        label={t('domain.domainForm.name')}
        required
        name='name'
        tooltip={t('domain.domainForm.nameTooltip')}
        rules={[
          {
            required: true,
            message: t('domain.domainForm.nameRequired')
          },
        ]}
      >
        <Input
          showCount
          allowClear
          disabled={value}
          maxLength={256}
          placeholder={t('domain.domainForm.namePlaceholder')}
        />
      </Form.Item>
      <Form.Item
        label={t('domain.domainForm.protocol')}
        required
        name='protocol'
        tooltip={t('domain.domainForm.protocolTooltip')}
        rules={[
          {
            required: true,
            message: t('domain.domainForm.protocolRequired'),
          },
        ]}
      >
        <Select
          allowClear
          placeholder={t('domain.domainForm.protocolPlaceholder')}
          onChange={(v) => setProtocol(v)}
        >
          <Option value={Protocol.Http}>HTTP</Option>
          <Option value={Protocol.Https}>HTTPS</Option>
        </Select>
      </Form.Item>
      {
        protocol === Protocol.Https ? (
          <div>
            <Form.Item
              label={t('domain.domainForm.certificate')}
              required
              name='certIdentifier'
              tooltip={t('domain.domainForm.certificateTooltip')}
              rules={[
                {
                  required: true,
                  message: t('domain.domainForm.certificateRequired'),
                },
              ]}
            >
              <Input
                showCount
                allowClear
                maxLength={256}
                placeholder={t('domain.domainForm.certificatePlaceholder')}
              />
            </Form.Item>
            <Form.Item
              name='mustHttps'
              tooltip={t('domain.domainForm.mustHttpsTooltip')}
            >
              <Checkbox.Group
                options={[
                  {
                    label: (
                      <>
                        <span style={{ marginRight: 4 }}>{t('domain.domainForm.mustHttps')}</span>
                        <Tooltip title={t('domain.domainForm.mustHttpsCheckboxTooltip')}>
                          <QuestionCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                        </Tooltip>
                      </>
                    ),
                    value: true
                  }
                ]}
              />
            </Form.Item>
          </div>
        ) : null
      }
    </Form>
  );
});

export default DomainForm;